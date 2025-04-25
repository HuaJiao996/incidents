import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServiceModule } from './service/service.module';
import { DatabaseModule } from '@libs/database';
import { AlertModule } from './alert/alert.module';
import { IncidentModule } from './incident/incident.module';
import { IncidentTypeModule } from './incident-type/incident-type.module';
import { ServiceRouteModule } from './service-route/service-route.module';
import { GlobalCustomFieldModule } from './global-custom-field/global-custom-field.module';

const modules = [ServiceModule];

@Module({
  imports: [
    DatabaseModule,
    RouterModule.register([
      {
        path: 'api',
        children: modules,
      },
    ]),
    ...modules,
    AlertModule,
    IncidentModule,
    IncidentTypeModule,
    ServiceRouteModule,
    GlobalCustomFieldModule,
  ],
})
export class ApiModule {}
