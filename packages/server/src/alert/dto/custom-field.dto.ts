import { CustomeFieldType } from '@/database/schema';

export class CustomFieldDto {
  path: string;
  type: CustomeFieldType;
  required: boolean;
  enumValues: unknown[];
}
