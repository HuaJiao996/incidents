import { databaseClient, type ServiceOrderByWithRelationInput, type ServiceWhereInput } from '@incidents/database'
import { status } from 'elysia';
import type { CreateServiceDTO, FindAllServiceQueryDTO } from './model';

export async function createService(userId: string, createServiceDto: CreateServiceDTO): Promise<string> {
    const service = await databaseClient.service.create({
      data: {
        ...createServiceDto,
        createdBy: { connect: { id: userId } },
        updatedBy: { connect: { id: userId } },
      },
      select: {
        id: true,
      },
    });

    return service.id;
  }

export  async function findAllService(query: FindAllServiceQueryDTO) {
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
    const where: ServiceWhereInput = {};
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
    const orderBy: ServiceOrderByWithRelationInput[] = [];
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
    const total = await databaseClient.service.count({ where });

    // 查询数据
    const services = await databaseClient.service.findMany({
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

  export async function findServiceById(id: string) {
    const service = await databaseClient.service.findFirst({
      where: { id: id },
      include: {
        incidentTypes: {
          orderBy: { priority: 'asc' },
        },
        customFields: true,
      },
    });

    if (!service) {
        return status('Not Found')
    }
    return service;
  }

  export function updateService(userId: string, id: string, updateServiceDto: CreateServiceDTO) {
    return databaseClient.service.update({
      where: { id: id },
      data: updateServiceDto,
    });
  }