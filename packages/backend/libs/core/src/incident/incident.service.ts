import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DatabaseService } from '@libs/database';
import { RuleEngine } from '@libs/common/rengine';
import { tryit } from 'radash';
import { Alert, IncidentSeverity, IncidentType } from '@prisma/client';

@Injectable()
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  constructor(
    @InjectQueue('incidentQueue') private readonly incidentQueue: Queue,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * 根据告警内容和事件类型的条件判断严重程度
   */
  private async determineSeverity(
    alert: Alert,
    incidentType: IncidentType,
  ): Promise<IncidentSeverity> {
    // 获取事件类型的所有严重程度条件
    const severityConditions = await this.databaseService.client.incidentTypeSeverityCondition.findMany({
      where: { incidentTypeId: incidentType.id },
      orderBy: { order: 'asc' },
    });

    if (!severityConditions || severityConditions.length === 0) {
      this.logger.warn(`No severity conditions found for incident type ${incidentType.id}, using default HIGH`);
      return IncidentSeverity.HIGH;
    }

    // 创建规则引擎实例
    const severityChecker = new RuleEngine<IncidentSeverity>();

    // 添加所有严重程度条件
    severityConditions.forEach((condition) => {
      severityChecker.appendRule(
        condition.condition,
        condition.severity,
        -condition.order, // 注意：这里取负数是因为RuleEngine按优先级降序排列，而我们的order是升序
      );
    });

    // 准备评估上下文
    const context = {
      alert,
      title: alert.title,
      content: alert.content,
      customFields: alert.customFields || {},
    };

    // 执行规则评估
    const [error, matchedSeverity] = await tryit(() => 
      severityChecker.run(context)
    )();

    if (error) {
      this.logger.error(
        `Error evaluating severity conditions: ${error.message}`,
        error.stack,
      );
      return IncidentSeverity.HIGH;
    }

    if (!matchedSeverity) {
      this.logger.warn(
        `No matching severity condition found for incident type ${incidentType.id}, using lowest severity`,
      );
      return severityConditions[severityConditions.length - 1].severity;
    }

    this.logger.debug(
      `Determined severity ${matchedSeverity} for alert ${alert.id}`,
    );
    return matchedSeverity;
  }

  async createIncident(
    alert: Alert, 
    incidentType: IncidentType,
    title: string,
    description: string,
  ) {
    this.logger.log(
      `Create incident: alertId=${alert.id}, incidentTypeId=${incidentType.id}, serviceId=${incidentType.serviceId}`,
    );
    
    // 确定事件严重程度
    const severity = await this.determineSeverity(alert, incidentType);
    this.logger.log(`Determined severity: ${severity} for alert ${alert.id}`);
    
    // 使用 Prisma 事务创建事件并更新告警
    const result = await this.databaseService.client.$transaction(async (tx) => {
      // 创建新事件
      const incident = await tx.incident.create({
        data: {
          title,
          typeId: incidentType.id,
          description,
          severity,
          serviceId: incidentType.serviceId
        },
      });

      // 更新告警，关联到新创建的事件
      const updatedAlert = await tx.alert.update({
        where: { id: alert.id },
        data: { incidentId: incident.id },
      });

      return { incident, updatedAlert };
    });

    this.logger.log(`Incident created successfully: incidentId=${result.incident.id}`);

    // 添加到处理队列
    await this.incidentQueue.add('process', {
      incidentId: result.incident.id,
      severity,
      serviceId: incidentType.serviceId,
    });

    return result.incident.id;
  }

  async resolveIncident(incidentId: number, alertId: number) {
    this.logger.log(
      `Resolving incident: incidentId=${incidentId}, alertId=${alertId}`,
    );

    return this.updateIncident(incidentId, alertId, true);
  }

  async updateIncident(incidentId: number, alertId: number, resolved: boolean) {
    this.logger.log(
      `Updating incident: incidentId=${incidentId}, alertId=${alertId}, resolved=${resolved}`,
    );

    const updateData: any = {
      lastAlertId: alertId,
    };

    if (resolved) {
      updateData.status = 'RESOLVED';
      updateData.resolvedAt = new Date();
    }

    // 使用 Prisma 更新事件
    const updatedIncident = await this.databaseService.client.incident.update({
      where: { id: incidentId },
      data: updateData,
    });

    this.logger.log(
      `Incident update success: incidentId=${incidentId}, status=${resolved ? 'resolved' : 'open'}`,
    );

    return true;
  }
}
