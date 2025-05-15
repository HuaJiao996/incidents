import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { AlertResponseDto } from './dto/alert.response.dto';

@Injectable()
export class AlertService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(page: number, pageSize: number): Promise<AlertResponseDto> {
    const alerts = await this.database.client.alert.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
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
