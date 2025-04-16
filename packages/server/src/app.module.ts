import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AlertModule } from './alert/alert.module';
import { BullModule } from '@nestjs/bullmq';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  BullModule.forRoot({
    connection: {
      host: 'localhost',
      port: 6379,
    },
  }), AuthModule, UsersModule,
    AlertModule,
    IncidentModule],
  providers: [UsersService],
})
export class AppModule { }
