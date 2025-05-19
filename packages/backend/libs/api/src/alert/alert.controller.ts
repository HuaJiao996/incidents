import { Controller, Get, Query } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dto/alert.response.dto';
import { FindAllAlertDto } from './dto/find-all-alert.dto';
import { ApiZodQuery } from '@libs/common/decorators';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiZodQuery(FindAllAlertDto)
  findAll(@Query() query: FindAllAlertDto): Promise<AlertResponseDto> {
    return this.alertService.findAll(query);
  }
}
