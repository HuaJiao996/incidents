import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AlertResponseDto } from './dto/alert.response.dto';
import { AlertPaginationQueryDto } from './dto/alert-pagination.query.dto';

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
  @ApiQuery({
    name: 'title',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'service',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'dateRange',
    type: [Date],
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    type: String,
    required: false,
  })
  findAll(@Query() params: AlertPaginationQueryDto): Promise<AlertResponseDto> {
    return this.alertService.findAll(params.page, params.pageSize, params.title, params.service, params.dateRange, params.orderBy);
  }
}
