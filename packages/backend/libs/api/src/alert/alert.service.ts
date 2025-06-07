import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@libs/database';
import { Prisma } from '@prisma/client';
import { AlertResponseDto } from './dto/alert.response.dto';
import { FindAllAlertDto } from './dto/find-all-alert.dto';

@Injectable()
export class AlertService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: FindAllAlertDto): Promise<AlertResponseDto> {
    const {
      page,
      pageSize,
      sortFields,
      sortOrders,
      titleValue,
      serviceValue,
      incidentIdValue,
      startTime,
      endTime,
    } = query;

    const where: Prisma.AlertWhereInput = {};

    // 处理过滤条件
    if (titleValue) {
      where.title = {
        contains: titleValue,
      };
    }

    if (serviceValue) {
      where.service = {
        OR: [{ id: serviceValue }, { name: { contains: serviceValue } }],
      };
    }

    if (incidentIdValue) {
      where.incidentId = +incidentIdValue;
    }

    // 处理时间范围
    if (startTime || endTime) {
      where.createdAt = {
        ...(startTime && { gte: new Date(startTime) }),
        ...(endTime && { lte: new Date(endTime) }),
      };
    }

    // 处理多字段排序
    let orderBy: Prisma.AlertOrderByWithRelationInput[] = [
      {
        createdAt: 'desc', // 默认排序
      },
    ];

    if (sortFields) {
      const fields = sortFields.split(',');
      const orders = sortOrders || fields.map(() => 'asc');

      orderBy = fields.map((field, index) => ({
        [field.trim()]: orders[index] || 'asc',
      }));
    }

    const [alerts, total] = await Promise.all([
      this.database.client.alert.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy,
        include: {
          service: true,
        },
      }),
      this.database.client.alert.count({
        where,
      }),
    ]);

    return {
      page,
      pageSize,
      data: alerts,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }
}
