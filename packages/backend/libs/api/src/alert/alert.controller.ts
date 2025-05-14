import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AlertResponseDto } from './dto/alert.response.dto';
import { AlertPaginationParamsDto } from './dto/alert-pagination.params.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: AlertResponseDto,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
  })
  findAll(@Query() params: AlertPaginationParamsDto): Promise<AlertResponseDto> {
    return this.alertService.findAll(params.page, params.pageSize);
  }
}
