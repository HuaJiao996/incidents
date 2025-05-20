import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from './incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '@libs/database';
import { IncidentSeverity } from '@prisma/client';

interface ProcessIncidentJob {
  incidentId: number;
  severity: IncidentSeverity;
  serviceId: string;
}

@Processor('incidentQueue')
export class IncidentProcessor extends WorkerHost {
  private readonly logger = new Logger(IncidentProcessor.name);
  
  constructor(
    private readonly incidentService: IncidentService,
    private readonly databaseService: DatabaseService,
  ) {
    super();
  }

  async process(job: Job<ProcessIncidentJob>) {
    const { incidentId, severity, serviceId } = job.data;
    
    this.logger.log(
      `Processing incident: id=${incidentId}, severity=${severity}, serviceId=${serviceId}`,
    );

    try {
      // 获取服务相关信息
      const service = await this.databaseService.client.service.findUnique({
        where: { id: serviceId },
        include: {
          customFields: true,
        },
      });

      if (!service) {
        throw new Error(`Service not found: ${serviceId}`);
      }

      // 根据严重程度执行不同的处理逻辑
      switch (severity) {
        case IncidentSeverity.CRITICAL:
          this.logger.log(`Critical incident detected: ${incidentId}`);
          // TODO: 实现关键事件的处理逻辑
          break;
        
        case IncidentSeverity.HIGH:
          this.logger.log(`High severity incident detected: ${incidentId}`);
          // TODO: 实现高优先级事件的处理逻辑
          break;
        
        case IncidentSeverity.MEDIUM:
          this.logger.log(`Medium severity incident detected: ${incidentId}`);
          // TODO: 实现中等优先级事件的处理逻辑
          break;
        
        case IncidentSeverity.LOW:
          this.logger.log(`Low severity incident detected: ${incidentId}`);
          // TODO: 实现低优先级事件的处理逻辑
          break;
        
        default:
          this.logger.warn(`Unknown severity level: ${severity}`);
      }

      // 更新事件状态为处理中
      await this.databaseService.client.incident.update({
        where: { id: incidentId },
        data: {
          status: 'IN_PROGRESS',
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Incident processed successfully: ${incidentId}`);
    } catch (error) {
      this.logger.error(
        `Error processing incident ${incidentId}:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }
}
