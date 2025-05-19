import { PaginationDto } from '@libs/common/dto';
import { IncidentDto, IncidentTypeDto, ServiceDto } from '@libs/database/dto';

export class IncidentWithServiceAndTypeDto extends IncidentDto {
  service: ServiceDto | null;
  type: IncidentTypeDto | null;
}

export class IncidentResponseDto extends PaginationDto {
  data: IncidentWithServiceAndTypeDto[];
}
