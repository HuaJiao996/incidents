import { CustomFieldType } from '@app/database/schema';

export class CustomFieldDto {
  path: string;
  type: CustomFieldType;
  required: boolean;
  enumValues: unknown[];
}
