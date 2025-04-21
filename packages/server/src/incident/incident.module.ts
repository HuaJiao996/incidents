import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { BullModule } from '@nestjs/bullmq';
import { IncidentProcessor } from './incident.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'incident',
      defaultJobOptions: {
        removeOnComplete: true, // 或设置为数字，表示保留的已完成任务数量
        removeOnFail: false, // 失败的任务不自动删除
        attempts: 3, // 失败后最多重试3次
        backoff: {
          // 重试间隔策略
          type: 'exponential', // 指数退避策略
          delay: 1000, // 初始延迟1秒，之后按指数增长
        },
      },
    }),
  ],
  providers: [IncidentService, IncidentProcessor],
  exports: [IncidentService],
})
export class IncidentModule {}
