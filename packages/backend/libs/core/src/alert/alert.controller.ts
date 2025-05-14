import { Body, Controller, Param, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlertCreatedResponseDto } from './dto/alert-created.response.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: AlertCreatedResponseDto,
  })
  async createAlert(@Body() createAlertDto: CreateAlertDto): Promise<AlertCreatedResponseDto> {
    return this.alertService.createAlert(createAlertDto);
  }

  @Post('services/:serviceId')
  @ApiParam({
    name: 'serviceId',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    type: AlertCreatedResponseDto,
  })
  async createAlertForService(
    @Param('serviceId') serviceId: string,
    @Body() createAlertDto: CreateAlertDto,
  ): Promise<AlertCreatedResponseDto> {
    return this.alertService.createAlertForService(createAlertDto, +serviceId);
  }
}