import { Injectable } from '@nestjs/common';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';

@Injectable()
export class IncidentTypeService {
  create(createIncidentTypeDto: CreateIncidentTypeDto) {
    return 'This action adds a new incidentType';
  }

  findAll() {
    return `This action returns all incidentType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incidentType`;
  }

  update(id: number, updateIncidentTypeDto: UpdateIncidentTypeDto) {
    return `This action updates a #${id} incidentType`;
  }

  remove(id: number) {
    return `This action removes a #${id} incidentType`;
  }
}
