import { $Enums, Incident, IncidentType } from '@prisma/client';

export class IncidentTypeDto implements IncidentType {
  name: string;
  id: number;
  serviceId: string;
  title: string;
  description: string;
  condition: string;
  groupCondition: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}