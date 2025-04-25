import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServiceModule } from './service/service.module';
import { DatabaseModule } from '@libs/database';

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
  ],
})
export class ApiModule {}
