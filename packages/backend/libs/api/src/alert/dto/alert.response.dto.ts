import { PaginationDto } from '@libs/common/dto';
import { AlertDto, ServiceDto } from '@libs/database/dto';

export class AlertWithServiceDto extends AlertDto {
  service: ServiceDto;
}
export class AlertResponseDto extends PaginationDto {
  data: AlertWithServiceDto[];
}
