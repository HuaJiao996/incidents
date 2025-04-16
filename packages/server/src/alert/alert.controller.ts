import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { service } from 'src/database/schema';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';

@Controller('alert')
export class AlertController {

  constructor(private readonly alertService: AlertService) {}

  @Post()
  async recive(@Body() alertDto: AlertDto) {
    return this.alertService.recive(alertDto);
  }

  @Post(':serviceId')
  async reciveWithServiceId(@Param('serviceId') serviceId: string, @Body() alertDto: AlertDto) {
    return this.alertService.reciveWithServiceId(alertDto, serviceId);
  }
}
