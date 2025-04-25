import { ApiModule } from '@libs/api';
import { CoreModule } from '@libs/core';
import { DatabaseModule } from '@libs/database';
import { RedisModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    ApiModule,
  ],
})
export class ServerModule {}
