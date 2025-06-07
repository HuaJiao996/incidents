import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentResponseDto } from './dto/incident.response.dto';
import { FindAllIncidentDto } from './dto/find-all-incident.dto';
import { ApiZodQuery } from '@libs/common/decorators';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  @ApiZodQuery(FindAllIncidentDto)
  findAll(@Query() query: FindAllIncidentDto): Promise<IncidentResponseDto> {
    return this.incidentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIncidentDto: CreateIncidentDto) {
  //   return this.incidentService.update(+id, updateIncidentDto);
  // }
}
