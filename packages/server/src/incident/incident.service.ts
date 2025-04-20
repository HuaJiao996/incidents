import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { alert, incident, incidentType } from '../database/schema';
import { eq } from 'drizzle-orm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class IncidentService {
    private readonly logger = new Logger(IncidentService.name);

    constructor(@InjectQueue('incident') private readonly incidentQueue: Queue, private readonly databaseService: DatabaseService) {}

    async createIncident(alertData: typeof alert.$inferSelect, incidentTypeData: typeof incidentType.$inferSelect) {
        this.logger.log(`创建事件: alertId=${alertData.id}, incidentTypeId=${incidentTypeData.id}, serviceId=${incidentTypeData.serviceId}`);
        
        // const result = await this.databaseService.getClient().insert(incident).values({
        //     title: 'New Incident',
        //     incidentTypeId: incidentType.id,
        //     description: 'New Incident',
        // }).returning({ id: incident.id });
        
        // const incidentId = result[0].id;
        // this.logger.log(`事件创建成功: incidentId=${incidentId}`);
        
        // // TODO: 触发事件分配流程
        // await this.assignIncident(incidentId);
        
        // return incidentId;
    }
    
    async updateIncident(incidentId: string, alertId: string, resolved: boolean) {
        this.logger.log(`更新事件: incidentId=${incidentId}, alertId=${alertId}, resolved=${resolved}`);
        
        const updateData: any = {
            lastAlertId: alertId,
        };
        
        if (resolved) {
            updateData.status = 'resolved';
            updateData.resolvedAt = new Date();
        }
        
        await this.databaseService.getClient()
            .update(incident)
            .set(updateData)
            .where(eq(incident.id, incidentId));
        
        this.logger.log(`事件更新成功: incidentId=${incidentId}, status=${resolved ? 'resolved' : 'open'}`);
        
        return true;
    }
    
    async findOpenIncidentByType(incidentTypeId: string) {
        return this.databaseService.getClient().query.incident.findFirst({
            where: (incident, { eq, and }) => and(
                eq(incident.incidentTypeId, incidentTypeId),
                eq(incident.status, 'triggered')
            ),
        });
    }
    
    private async assignIncident(incidentId: string) {
        this.logger.log(`开始分配事件: incidentId=${incidentId}`);
        // TODO: 实现事件分配逻辑
        // 这里将来会调用 IncidentAssigner 服务
        this.logger.log(`事件分配完成: incidentId=${incidentId}`);
    }
}
