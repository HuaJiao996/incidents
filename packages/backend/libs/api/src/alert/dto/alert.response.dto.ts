import { AlertDto, PaginationDto } from '@libs/common/dto';

export class AlertResponseDto extends PaginationDto {
  data: AlertDto[];
}
