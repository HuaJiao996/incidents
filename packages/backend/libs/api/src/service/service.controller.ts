import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServiceDto } from './dto/find-all-service.dto';
import { ApiZodQuery } from '@libs/common/decorators';
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto): Promise<string> {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiZodQuery(FindAllServiceDto)
  findAll(@Query() query: FindAllServiceDto) {
    return this.serviceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: CreateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }
}
