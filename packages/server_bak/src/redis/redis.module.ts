import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';

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
          provide: 'BULL_CONNECTION',
          useFactory: (redisService: RedisService) => {
            return {
              connection: redisService.getClient(),
            };
          },
          inject: [RedisService],
        },
        RedisService,
      ],
      exports: [RedisService, 'BULL_CONNECTION'],
      global: true,
    };
  }
}
