import { Injectable } from '@nestjs/common';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Prisma, IncidentStatus } from '@prisma/client';
import { IncidentResponseDto } from './dto/incident.response.dto';
import { DatabaseService } from '@libs/database';
import { FindAllIncidentDto } from './dto/find-all-incident.dto';

@Injectable()
export class IncidentService {

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(query: FindAllIncidentDto): Promise<IncidentResponseDto> {
    const { 
      page, 
      pageSize, 
      sortFields, 
      sortOrders, 
      titleValue, 
      serviceValue, 
      incidentIdValue, 
      statusValue,
      startTime, 
      endTime,
      updatedAtStart,
      updatedAtEnd,
    } = query;

    const where: Prisma.IncidentWhereInput = {};
    
    if (titleValue) {
      where.title = { contains: titleValue };
    }
    
    if (serviceValue) {
      const serviceIds = serviceValue.split(',');
      if (serviceIds.length > 0) {
        where.serviceId = { in: serviceIds };
      }
    }
    
    if (incidentIdValue) {
      where.id = { equals: parseInt(incidentIdValue) };
    }

    if (statusValue) {
      const statuses = statusValue.split(',').filter(Boolean) as IncidentStatus[];
      if (statuses.length > 0) {
        where.status = { in: statuses };
      }
    }

    // 创建时间范围
    if (startTime || endTime) {
      where.createdAt = {};
      if (startTime) {
        where.createdAt.gte = new Date(startTime);
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime);
      }
    }

    // 更新时间范围
    if (updatedAtStart || updatedAtEnd) {
      where.updatedAt = {};
      if (updatedAtStart) {
        where.updatedAt.gte = new Date(updatedAtStart);
      }
      if (updatedAtEnd) {
        where.updatedAt.lte = new Date(updatedAtEnd);
      }
    }

    const orderBy: Prisma.IncidentOrderByWithRelationInput[] = [];
    if (sortFields && sortOrders) {
      const fields = (sortFields || '').toString().split(',');
      const orders = (sortOrders || '').toString().split(',');
      fields.forEach((field, index) => {
        if (orders[index]) {
          orderBy.push({ [field]: orders[index] });
        }
      });
    }

    const incidents = await this.databaseService.client.incident.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        service: true,
        type: true,
      },
    });

    const total = await this.databaseService.client.incident.count({
      where,
    });

    return {
      data: incidents,
      total,
      page,
      pageSize,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} incident`;
  }

  update(id: number, updateIncidentDto: UpdateIncidentDto) {
    return `This action updates a #${id} incident`;
  }

}
