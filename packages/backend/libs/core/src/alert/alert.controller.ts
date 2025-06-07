import { Body, Controller, Param, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertCreatedResponseDto } from './dto/alert-created.response.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  async createAlert(
    @Body() createAlertDto: CreateAlertDto,
  ): Promise<AlertCreatedResponseDto> {
    return this.alertService.createAlert(createAlertDto);
  }

  @Post('services/:serviceId')
  async createAlertForService(
    @Param('serviceId') serviceId: string,
    @Body() createAlertDto: CreateAlertDto,
  ): Promise<AlertCreatedResponseDto> {
    return this.alertService.createAlertForService(createAlertDto, serviceId);
  }
}
