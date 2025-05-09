import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DatabaseService } from '@libs/database';
import { Alert, IncidentType } from '@libs/database/prisma';

@Injectable()
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  constructor(
    @InjectQueue('incidentQueue') private readonly incidentQueue: Queue,
    private readonly databaseService: DatabaseService,
  ) {}

  async createIncident(alert: Alert, incidentType: IncidentType) {
    this.logger.log(
      `Create incident: alertId=${alert.id}, incidentTypeId=${incidentType.id}, serviceId=${incidentType.serviceId}`,
    );
    
    // 使用 Prisma 事务创建事件并更新告警
    const result = await this.databaseService.client.$transaction(async (tx) => {
      // 创建新事件
      const incident = await tx.incident.create({
        data: {
          title: alert.title,
          typeId: incidentType.id,
          description: alert.content,
          severity: 'HIGH',
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

    // TODO: 触发事件分配流程
    // await this.assignIncident(incidentId);

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
