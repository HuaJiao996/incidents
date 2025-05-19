import { Controller, Get, Query } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dto/alert.response.dto';
import { AlertPaginationQueryDto } from './dto/alert-pagination.query.dto';
import { ApiZodQuery } from '@libs/common/decorators';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiZodQuery(AlertPaginationQueryDto)
  findAll(@Query() query: AlertPaginationQueryDto): Promise<AlertResponseDto> {
    return this.alertService.findAll(query);
  }
}
