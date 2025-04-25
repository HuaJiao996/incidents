import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
export const REDIS_CONNECTION_PROVIDER = 'REDIS_CONNECTION';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CONNECTION_PROVIDER,
          useFactory: (redisService: RedisService) => {
            return {
              connection: redisService.getClient(),
            };
          },
          inject: [RedisService],
        },
        RedisService,
      ],
      exports: [RedisService, 'REDIS_CONNECTION'],
      global: true,
    };
  }
}
