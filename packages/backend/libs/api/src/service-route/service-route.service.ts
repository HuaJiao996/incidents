import { Injectable } from '@nestjs/common';
import { CreateServiceRouteDto } from './dto/create-service-route.dto';
import { UpdateServiceRouteDto } from './dto/update-service-route.dto';

@Injectable()
export class ServiceRouteService {
  create(createServiceRouteDto: CreateServiceRouteDto) {
    return 'This action adds a new serviceRoute';
  }

  findAll() {
    return `This action returns all serviceRoute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceRoute`;
  }

  update(id: number, updateServiceRouteDto: UpdateServiceRouteDto) {
    return `This action updates a #${id} serviceRoute`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceRoute`;
  }
}
