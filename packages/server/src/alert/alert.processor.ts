import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from '@/incident/incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { RuleEngine } from '@/common/rule-engine/rule-engine';
import { TopLevelCondition } from 'json-rules-engine';
import { tryit } from 'radash';
import { Alert, AlertType, IncidentType } from '@/database/schema';

@Processor('alertQueue')
export class AlertProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertProcessor.name);
  constructor(
    private readonly incidentService: IncidentService,
    private readonly databaseService: DatabaseService,
  ) {
    super();
  }

  async process(job: Job<string>) {
    this.logger.log(job.data);
    
    // 获取告警数据
    const alert = await this.fetchAlert(job.data);
    if (!alert?.service) {
      throw new Error(`Alert not found ${job.data}`);
    }

    // 匹配事件类型
    const matchedIncidentType = await this.matchIncidentType(alert);
    if (!matchedIncidentType) {
      return;
    }

    // 匹配分组
    const group = await this.matchGroup(alert, matchedIncidentType.id);
    if (!group) {
      return;
    }

    // 确定状态
    const status = await this.determineStatus(alert, matchedIncidentType.id, group.id);
    this.logger.debug(status);

    // 处理事件
    await this.handleIncident(alert, matchedIncidentType, group.id, status);

    this.logger.log(`Alert processing completed: ${job.data}`);
    return { success: true };
  }

  private async fetchAlert(alertId: string) {
    return this.databaseService.getClient().query.alertTable.findFirst({
      where: (alert, { eq }) => eq(alert.id, alertId),
      with: {
        service: {
          with: {
            incidentTypes: true,
          },
        },
      },
    });
  }

  
  
  private async matchIncidentType(alert: Exclude<Awaited<ReturnType<typeof this.fetchAlert>>, undefined>) {
    const incidentTypeChecker = new RuleEngine();
    alert.service!.incidentTypes.forEach((incidentType) => {
      incidentTypeChecker.appendRule(
        incidentType.condition,
        { incidentType },
        incidentType.order,
      );
    });

    const [error, matchedIncidentType] = await tryit(() =>
      incidentTypeChecker
        .run(alert)
        .then(
          ({ events }) =>
            events[0]?.params?.incidentType as Exclude<
              typeof alert.service,
              null
            >['incidentTypes'][number],
        ),
    )();
    
    if (error) {
      this.logger.error(error);
      return null; // 处理错误
    }
    
    this.logger.debug(matchedIncidentType);

    if (!matchedIncidentType) {
      this.logger.error('没有匹配的 Incident Type');
      return null; // 处理错误
    }
    
    return matchedIncidentType;
  }

  private async matchGroup(alert: Record<string, unknown>, incidentTypeId: string) {
    const groups = await this.databaseService
      .getClient()
      .query.incidentTypeGroupTable.findMany({
        where: (incidentTypeGroup, { eq }) =>
          eq(incidentTypeGroup.incidentTypeId, incidentTypeId),
      });

    const groupChecker = new RuleEngine();
    groups.forEach((group) => {
      groupChecker.appendRule(
        group.condition as TopLevelCondition,
        { group },
        group.order,
      );
    });

    const group = await groupChecker
      .run(alert)
      .then(
        ({ events }) => events[0]?.params?.group as (typeof groups)[number],
      );

    if (!group) {
      this.logger.error('No matching group found');
      return null; // 处理错误
    }
    
    return group;
  }

  private async determineStatus(alert: { type: AlertType | null }, incidentTypeId: string, groupId: string) {
    let status = alert.type;
    if (!status) {
      const statusConditions = await this.databaseService
        .getClient()
        .query.incidentTypeStatusConditionTable.findMany({
          where: (incidentTypeStatusCondition, { eq, and }) =>
            and(
              eq(incidentTypeStatusCondition.incidentTypeId, incidentTypeId),
              eq(incidentTypeStatusCondition.groupId, groupId),
            ),
        });

      const statusChecker = new RuleEngine();
      statusConditions.forEach((statusCondition) => {
        statusChecker.appendRule(
          statusCondition.condition, 
          { status: statusCondition.status }, 
          statusCondition.order
        );
      });

      status = await statusChecker
        .run(alert)
        .then(
          ({ events }) => events[0]?.params?.status as 'trigger' | 'resolve',
        );
    }
    
    return status;
  }

  private async handleIncident(
    alert: Alert,
    incidentType: IncidentType,
    groupId: string,
    status: AlertType | null,
  ) {
    // 根据匹配的 Incident Type 确认当前是否存在未 Resolved 的 Incident
    const existingIncident = await this.incidentService.findOpenIncidentByType(
      incidentType.id,
      groupId,
    );

    if (existingIncident) {
      // 存在未解决的事件，将 Alert 数据更新到 Incident 中
      this.logger.log(`Found unresolved incident: ${existingIncident.id}, updating incident information`);
      
      // 根据 Alert 状态决定是否将 Incident 标记为已解决
      if (status === 'resolve') {
        // 将 Incident 数据更新为 Resolved
        await this.incidentService.resolveIncident(
          existingIncident.id,
          alert.id,
          true,
        );
        this.logger.log(`Incident has been marked as resolved: ${existingIncident.id}`);
      } else {
        // 仅更新 Alert 关联，不改变状态
        await this.incidentService.createChildIncident(
          existingIncident.id,
          alert.id,
          false,
        );
        this.logger.log(`Incident has been updated with latest alert: ${existingIncident.id}`);
      }
      return;
    } else {
      const incidentId = await this.incidentService.createIncident(
        alert,
        incidentType,
        groupId,
        status === 'resolve' ? 'resolved' : 'triggered',
      );
      
      this.logger.log(`New incident created: ${incidentId}`);
    }
  }
}
