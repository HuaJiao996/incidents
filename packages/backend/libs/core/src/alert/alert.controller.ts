import { Body, Controller, Param, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  async receive(@Body() alertDto: AlertDto) {
    return this.alertService.receive(alertDto);
  }

  @Post(':serviceId')
  async receiveWithServiceId(
    @Param('serviceId') serviceId: string,
    @Body() alertDto: AlertDto,
  ) {
    return this.alertService.receiveWithServiceId(alertDto, +serviceId);
  }
}
