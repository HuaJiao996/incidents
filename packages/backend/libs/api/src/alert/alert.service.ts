import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { AlertResponseDto } from './dto/alert.response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlertService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(page: number, pageSize: number, title?: string, service?: string, dateRange?: Date[], orderBy?: string): Promise<AlertResponseDto> {
    const where: Prisma.AlertWhereInput = {};
    if (title) {
      where.title = {
        contains: title,
      };
    }
    if (service) {
      where.service = {
        id: +service,
      };
    }
    if (dateRange) {
      where.createdAt = {
        gte: dateRange[0],
        lte: dateRange[1],
      };
    }
    
    const alerts = await this.database.client.alert.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      include: {
        service: true,
      },
    });

    const total = await this.database.client.alert.count();

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
