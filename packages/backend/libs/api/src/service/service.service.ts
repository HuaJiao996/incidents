import { DatabaseService } from '@libs/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServiceDto } from './dto/find-all-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createServiceDto: CreateServiceDto): Promise<string> {
    const service = await this.databaseService.client.service.create({
      data: createServiceDto,
      select: {
        id: true,
      },
    });

    return service.id;
  }

  async findAll(query: FindAllServiceDto) {
    const {
      page = 1,
      pageSize = 10,
      sortFields,
      sortOrders,
      idValue,
      nameValue,
      descriptionValue,
      startTime,
      endTime,
    } = query;

    // 构建过滤条件
    const where: Prisma.ServiceWhereInput = {};
    if (idValue) {
      where.id = idValue;
    }
    if (nameValue) {
      where.name = { contains: nameValue };
    }
    if (descriptionValue) {
      where.description = { contains: descriptionValue };
    }

    // 处理时间范围
    if (startTime || endTime) {
      where.createdAt = {};
      if (startTime) {
        where.createdAt.gte = new Date(startTime);
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime);
      }
    }

    // 构建排序条件
    const orderBy: Prisma.ServiceOrderByWithRelationInput[] = [];
    if (sortFields && sortOrders) {
      const fields = sortFields.split(',');
      const orders = (sortOrders || '').toString().split(',');
      fields.forEach((field, index) => {
        orderBy.push({
          [field]: orders[index] === 'asc' ? 'asc' : 'desc',
        });
      });
    }

    // 查询总数
    const total = await this.databaseService.client.service.count({ where });

    // 查询数据
    const services = await this.databaseService.client.service.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: services,
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const service = await this.databaseService.client.service.findFirst({
      where: { id: id },
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
      where: { id: id },
      data: updateServiceDto,
    });
  }
}
