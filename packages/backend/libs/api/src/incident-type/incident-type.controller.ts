import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncidentTypeService } from './incident-type.service';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';

@Controller('incident-type')
export class IncidentTypeController {
  constructor(private readonly incidentTypeService: IncidentTypeService) {}

  @Post(':serviceId')
  create(
    @Param('serviceId') serviceId: string,
    @Body() createIncidentTypeDto: CreateIncidentTypeDto,
  ) {
    return this.incidentTypeService.create(createIncidentTypeDto);
  }

  @Get(':serviceId')
  findAll(@Param('serviceId') serviceId: string) {
    return this.incidentTypeService.findAll();
  }

  @Get(':serviceId/:id')
  findOne(@Param('serviceId') serviceId: string, @Param('id') id: string) {
    return this.incidentTypeService.findOne(+id);
  }

  @Patch(':serviceId/:id')
  update(
    @Param('serviceId') serviceId: string,
    @Param('id') id: string,
    @Body() updateIncidentTypeDto: UpdateIncidentTypeDto,
  ) {
    return this.incidentTypeService.update(+id, updateIncidentTypeDto);
  }

  @Delete(':serviceId/:id')
  remove(@Param('serviceId') serviceId: string, @Param('id') id: string) {
    return this.incidentTypeService.remove(+id);
  }
}
