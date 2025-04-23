import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Alert, alertTable, childIncidentTable, Incident, IncidentStatus, incidentTable, IncidentType, incidentTypeTable } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IncidentService {

  private readonly logger = new Logger(IncidentService.name);

  constructor(
    @InjectQueue('incidentQueue') private readonly incidentQueue: Queue,
    private readonly databaseService: DatabaseService,
  ) { }

  async createIncident(
    alert: Alert, incidentType: IncidentType, groupId: string, status: IncidentStatus = 'triggered',
  ) {
    this.logger.log(
      `Create incident: alertId=${alert.id}, incidentTypeId=${incidentType.id}, serviceId=${incidentType.serviceId}`,
    );
    const [alertId, incidentId] = await this.databaseService.getClient().transaction(async (tx) => {
      const insertIncident = await tx.insert(incidentTable).values({
        title: alert.title,
        incidentTypeId: incidentType.id,
        description: alert.content,
        incidentTypeGroupId: groupId,
        status
      }).returning();

      const alertId = tx.update(alertTable).set({
        incidentId: insertIncident[0].id,
      }).where(eq(alertTable.id, alert.id)).returning({ id: alertTable.id });

      return [
        alertId,
        insertIncident[0].id,
      ];
    })

    this.logger.log(`Incident created successfully: incidentId=${incidentId}`);

    // TODO: 触发事件分配流程
    // await this.assignIncident(incidentId);

    return incidentId;
  }

  async resolveIncident(incidentId: string, alertId: string) {
    this.logger.log(
      `Resolving incident: incidentId=${incidentId}, alertId=${alertId}`,
    );
    
    return this.updateIncident(incidentId, alertId, true);
  }

  async createChildIncident(alert: Alert, parentIncident: Incident) {
    this.logger.log(
      `Create child incident: alertId=${alert.id}, parentIncident=${parentIncident.id}`,
    );
    const [alertId, incidentId] = await this.databaseService.getClient().transaction(async (tx) => {
      const childIncident = await tx.insert(incidentTable).values({
        title: alert.title,
        incidentTypeId: parentIncident.incidentTypeId,
        description: alert.content,
        incidentTypeGroupId: parentIncident.incidentTypeGroupId,
        status: 'triggered',
      }).returning();

      const alertId = await tx.update(alertTable).set({
        incidentId: childIncident[0].id,
      }).where(eq(alertTable.id, alert.id)).returning({ id: alertTable.id });

      await tx.insert(childIncidentTable).values({
        id: childIncident[0].id,
        parentId: parentIncident.id,
      });

      return [
        alertId,
        childIncident[0].id,
      ];
    })

    this.logger.log(`Child incident create success: childIncidentId=${incidentId}, parentIncidentId=${parentIncident.id}`);
  }

  async updateIncident(incidentId: string, alertId: string, resolved: boolean) {
    this.logger.log(
      `Updating incident: incidentId=${incidentId}, alertId=${alertId}, resolved=${resolved}`,
    );

    const updateData: any = {
      lastAlertId: alertId,
    };

    if (resolved) {
      updateData.status = 'resolved';
      updateData.resolvedAt = new Date();
    }

    await this.databaseService
      .getClient()
      .update(incidentTable)
      .set(updateData)
      .where(eq(incidentTable.id, incidentId));

    this.logger.log(
      `Incident update success: incidentId=${incidentId}, status=${resolved ? 'resolved' : 'open'}`,
    );

    return true;
  }

  async findOpenIncidentByType(incidentTypeId: string, groupId: string) {
    return this.databaseService.getClient().query.incidentTable.findFirst({
      where: (incident, { eq, and, ne }) =>
        and(
          ne(incident.status, 'triggered'),
          eq(incident.incidentTypeId, incidentTypeId),
          eq(incident.incidentTypeGroupId, groupId),
        ),
    });
  }

  private async assignIncident(incidentId: string) {
    this.logger.log(`Starting incident assignment: incidentId=${incidentId}`);
    // TODO: 实现事件分配逻辑
    this.logger.log(`Incident assignment completed: incidentId=${incidentId}`);
  }
}
