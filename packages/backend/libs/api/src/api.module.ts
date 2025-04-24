import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServiceModule } from './service/service.module';

const modules = [
  ServiceModule,
]

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api',
        children: modules
      }
    ]),
    ...modules,
  ],
})
export class ApiModule {}
