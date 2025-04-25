import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalCustomFieldDto } from './create-global-custom-field.dto';

export class UpdateGlobalCustomFieldDto extends PartialType(CreateGlobalCustomFieldDto) {}
