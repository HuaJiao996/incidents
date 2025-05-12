import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlertResponseDto } from './dto/alert.response.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiOperation({ summary: '获取所有告警' })
  @ApiResponse({
    status: 200,
    type: AlertResponseDto,
    isArray: true
  })
  findAll() {
    return this.alertService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: AlertResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.alertService.findOne(+id);
  }
}
