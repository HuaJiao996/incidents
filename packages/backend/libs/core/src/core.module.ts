import { Module } from '@nestjs/common';
import { AlertModule } from './alert/alert.module';
import { IncidentModule } from './incident/incident.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.forRootAsync({
    useFactory: (bullConnection: any) => bullConnection,
    inject: ['REDIS_CONNECTION'],
  }), AlertModule, IncidentModule],
  providers: [],
  exports: [],
})
export class CoreModule { }
