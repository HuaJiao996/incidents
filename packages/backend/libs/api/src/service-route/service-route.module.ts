import { Module } from '@nestjs/common';
import { ServiceRouteService } from './service-route.service';
import { ServiceRouteController } from './service-route.controller';

@Module({
  controllers: [ServiceRouteController],
  providers: [ServiceRouteService],
})
export class ServiceRouteModule {}
