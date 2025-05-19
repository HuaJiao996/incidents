import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ApiZodQuery } from '@libs/common/decorators';
import { IncidentPaginationQueryDto } from './dto/incident-pagination.query.dto';
import { IncidentResponseDto } from './dto/incident.response.dto';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  @ApiZodQuery(IncidentPaginationQueryDto)
  findAll(@Query() query: IncidentPaginationQueryDto): Promise<IncidentResponseDto> {
    return this.incidentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.update(+id, updateIncidentDto);
  }

}
