import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceRouteService } from './service-route.service';
import { CreateServiceRouteDto } from './dto/create-service-route.dto';
import { UpdateServiceRouteDto } from './dto/update-service-route.dto';

@Controller('service-route')
export class ServiceRouteController {
  constructor(private readonly serviceRouteService: ServiceRouteService) {}

  @Post()
  create(@Body() createServiceRouteDto: CreateServiceRouteDto) {
    return this.serviceRouteService.create(createServiceRouteDto);
  }

  @Get()
  findAll() {
    return this.serviceRouteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRouteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceRouteDto: UpdateServiceRouteDto,
  ) {
    return this.serviceRouteService.update(+id, updateServiceRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRouteService.remove(+id);
  }
}
