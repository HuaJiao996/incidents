import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  constructor (private readonly database: DatabaseService) {

  }

  async findAll() {
    const alerts = await this.database.client.alert.findMany({
      include: {
        service: true,
      }
    });

    return alerts;
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }
}
