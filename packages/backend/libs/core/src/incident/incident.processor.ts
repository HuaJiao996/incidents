import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from './incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '@libs/database';

@Processor('incidentQueue')
export class IncidentProcessor extends WorkerHost {
  private readonly logger = new Logger(IncidentProcessor.name);
  constructor(
    private readonly incidentService: IncidentService,
    private readonly databaseService: DatabaseService,
  ) {
    super();
  }
  async process(job: Job<string>, _token?: string) {
    this.logger.log(job.data);
    // TODO: 处理事件，生成事件ID
  }
}
