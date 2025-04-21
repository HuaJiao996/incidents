import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from '@/incident/incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { RuleEngine } from '@/common/rule-engine/rule-engine';
import { TopLevelCondition } from 'json-rules-engine';
import { tryit } from 'radash';
import { and } from 'drizzle-orm';
import { incidentType, incidentTypeGroup } from '@/database/schema';

@Processor('alert')
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
    const alert = await this.databaseService.getClient().query.alert.findFirst({
      where: (alert, { eq }) => eq(alert.id, job.data),
      with: {
        service: {
          with: {
            incidentTypes: true,
          },
        },
      },
    });
    if (!alert?.service) {
      throw new Error('Alert not found');
    }

    const incidentTypeChecker = new RuleEngine();
    alert.service.incidentTypes.forEach((incidentType) => {
      incidentTypeChecker.appendRule(
        incidentType.condition as TopLevelCondition,
        { incidentType },
        incidentType.order,
      );
    });

    const [error, matchedIncidentType] = await tryit(async () =>
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
      return; // TODO: handle error
    }
    this.logger.debug(matchedIncidentType);

    if (!matchedIncidentType) {
      this.logger.error('没有匹配的 Incident Type');
      return; // TODO: handle error
    }

    const groups = await this.databaseService
      .getClient()
      .query.incidentTypeGroup.findMany({
        where: (incidentTypeGroup, { eq }) =>
          eq(incidentTypeGroup.incidentTypeId, matchedIncidentType.id),
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
      this.logger.error('没有匹配的 Group');
      return; // TODO: handle error
    }

    let status = alert.type;
    if (!status) {
      const statusConditions = await this.databaseService
        .getClient()
        .query.incidentTypeStatusCondition.findMany({
          where: (incidentTypeStatusCondition, { eq }) =>
            and(
              eq(incidentTypeStatusCondition.incidentTypeId, incidentType.id),
              eq(incidentTypeStatusCondition.groupId, incidentTypeGroup.id),
            ),
        });

      const statusChecker = new RuleEngine();
      statusConditions.forEach((statusCondition) => {
        statusChecker.addRule({
          conditions: statusCondition.condition as TopLevelCondition,
          event: { type: 'matched', params: { status: statusCondition.status } },
          priority: statusCondition.order,
        });
      });

      status = await statusChecker
        .run(alert)
        .then(
          ({ events }) => events[0]?.params?.status as 'trigger' | 'resolve',
        );
    }

    this.logger.debug(status);

    // 根据匹配的 Incident Type 确认当前是否存在未 Resolved 的 Incident
    const existingIncident = await this.incidentService.findOpenIncidentByType(
      matchedIncidentType.id,
    );

    if (existingIncident) {
      // 存在未解决的事件，将 Alert 数据更新到 Incident 中
      this.logger.log(`找到未解决的事件: ${existingIncident.id}, 更新事件信息`);

      // 根据 Alert 状态决定是否将 Incident 标记为已解决
      if (status === 'resolve') {
        // 将 Incident 数据更新为 Resolved
        await this.incidentService.updateIncident(
          existingIncident.id,
          job.data,
          true,
        );
        this.logger.log(`事件已标记为已解决: ${existingIncident.id}`);
      } else {
        // 仅更新 Alert 关联，不改变状态
        await this.incidentService.updateIncident(
          existingIncident.id,
          job.data,
          false,
        );
        this.logger.log(`事件已更新最新告警: ${existingIncident.id}`);
      }
    } else {
      // 不存在未解决的事件
      if (status === 'resolve') {
        // 如果是解决状态的告警，且没有关联的未解决事件，则不处理
        this.logger.log('收到解决状态的告警，但没有关联的未解决事件，不处理');
      } else {
        // 创建新的 Incident
        this.logger.log('创建新的事件');
        const incidentId = await this.incidentService.createIncident(
          alert,
          matchedIncidentType,
        );
        this.logger.log(`新事件已创建: ${incidentId}`);
      }
    }

    this.logger.log(`告警处理完成: ${job.data}`);
    return { success: true };
  }
}
