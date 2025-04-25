import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncidentTypeService } from './incident-type.service';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';

@Controller('incident-type')
export class IncidentTypeController {
  constructor(private readonly incidentTypeService: IncidentTypeService) {}

  @Post()
  create(@Body() createIncidentTypeDto: CreateIncidentTypeDto) {
    return this.incidentTypeService.create(createIncidentTypeDto);
  }

  @Get()
  findAll() {
    return this.incidentTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentTypeDto: UpdateIncidentTypeDto) {
    return this.incidentTypeService.update(+id, updateIncidentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentTypeService.remove(+id);
  }
}
