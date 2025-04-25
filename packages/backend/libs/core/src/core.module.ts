import { Module } from '@nestjs/common';
import { AlertModule } from './alert/alert.module';
import { IncidentModule } from './incident/incident.module';
import { BullModule } from '@nestjs/bullmq';
import { REDIS_CONNECTION_PROVIDER, RedisModule } from '@libs/redis';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    RedisModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (bullConnection: any) => bullConnection,
      inject: [REDIS_CONNECTION_PROVIDER],
    }),
    DatabaseModule,
    AlertModule,
    IncidentModule,
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
