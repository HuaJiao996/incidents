import { CustomFieldType } from '@/database/schema';

export class CustomFieldDto {
  path: string;
  type: CustomFieldType;
  required: boolean;
  enumValues: unknown[];
}
