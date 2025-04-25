import { Module } from '@nestjs/common';
import { GlobalCustomFieldService } from './global-custom-field.service';
import { GlobalCustomFieldController } from './global-custom-field.controller';

@Module({
  controllers: [GlobalCustomFieldController],
  providers: [GlobalCustomFieldService],
})
export class GlobalCustomFieldModule {}
