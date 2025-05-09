import { DatabaseService } from '@libs/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async create(createServiceDto: CreateServiceDto) {
    const service = await this.databaseService.client.$transaction(async (tx) => {
      const service = await tx.service.create({
        data: createServiceDto
      });

      await tx.incidentType.create({
        data: {
          name: 'Default Incident',
          serviceId: service.id,
          priority: 0,
          description: 'Default Incident',
        }
      });

      return service;
    });
      
    return service;
  }

  async findAll() {
    const services = await this.databaseService.client.service.findMany();
    return services;
  }

  async findOne(id: string) {
    const service = await this.databaseService.client.service.findFirst({
      where: { id: +id },
      include: {
        incidentTypes: {
          orderBy: { priority: 'asc' },
        },
        customFields: true,
      },
    });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return service;
  }

  update(id: string, updateServiceDto: CreateServiceDto) {
    return this.databaseService.client.service.update({
      where: { id: +id },
      data: updateServiceDto
    });
  }
}
