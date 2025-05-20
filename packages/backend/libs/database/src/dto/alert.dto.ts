import { Alert } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class AlertDto implements Alert {
  id: number;

  title: string;

  content: string;

  customFields: JsonValue | null;

  serviceId: string;

  incidentId: number | null;

  createdAt: Date;

  updatedAt: Date;
}
