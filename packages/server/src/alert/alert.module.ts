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
    }),
    IncidentModule
  ],
  controllers: [AlertController],
  providers: [AlertService, 
    AlertProcessor
  ]
})
export class AlertModule {}
