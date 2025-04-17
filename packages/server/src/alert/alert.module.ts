import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertProcessor } from './alert.processor';
import { BullModule } from '@nestjs/bullmq';
import { IncidentModule } from '../incident/incident.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'alert',
      defaultJobOptions: {
        removeOnComplete: true, // 或设置为数字，表示保留的已完成任务数量
        removeOnFail: false,    // 失败的任务不自动删除
        attempts: 3,            // 失败后最多重试3次
        backoff: {              // 重试间隔策略
          type: 'exponential',  // 指数退避策略
          delay: 1000           // 初始延迟1秒，之后按指数增长
        },
      },
    }),
    IncidentModule
  ],
  controllers: [AlertController],
  providers: [AlertService, 
    AlertProcessor
  ]
})
export class AlertModule {}
