import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AlertModule } from './alert/alert.module';
import { BullModule } from '@nestjs/bullmq';
import { IncidentModule } from './incident/incident.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (bullConnection: any) => bullConnection,
      inject: ['BULL_CONNECTION'],
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    AlertModule,
    IncidentModule,
  ],
  providers: [UsersService],
})
export class AppModule {}
