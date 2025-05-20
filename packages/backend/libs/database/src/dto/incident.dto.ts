import { $Enums, Incident } from '@prisma/client';
import { ServiceDto } from './service.dto';
import { IncidentTypeDto } from './incident-type.dto';

export class IncidentDto implements Incident {
  id: number;
  title: string;
  description: string | null;
  status: $Enums.IncidentStatus;
  severity: $Enums.IncidentSeverity;
  serviceId: string;
  typeId: number | null;
  createdAt: Date;
  updatedAt: Date;

}

