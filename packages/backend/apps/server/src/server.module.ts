import { ApiModule } from '@app/api';
import { CoreModule } from '@app/core';
import { DatabaseModule } from '@app/database';
import { RedisModule } from '@app/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot(),
    DatabaseModule,
    CoreModule,
    ApiModule
  ]
})
export class ServerModule {}
