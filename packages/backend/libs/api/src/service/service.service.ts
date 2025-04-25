import { DatabaseService } from '@libs/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { serviceTable } from '@libs/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ServiceService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createServiceDto: CreateServiceDto) {
    const service = await this.databaseService
      .getClient()
      .insert(serviceTable)
      .values(createServiceDto)
      .returning();
    return service[0];
  }

  async findAll() {
    const services = await this.databaseService
      .getClient()
      .query.serviceTable.findMany();
    return services;
  }

  async findOne(id: string) {
    const service = await this.databaseService
      .getClient()
      .query.serviceTable.findFirst({
        where: (service, { eq }) => eq(service.id, id),
      });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return service;
  }

  update(id: string, updateServiceDto: CreateServiceDto) {
    const service = this.databaseService
      .getClient()
      .update(serviceTable)
      .set(updateServiceDto)
      .where(eq(serviceTable.id, id))
      .returning();
    return service;
  }
}
