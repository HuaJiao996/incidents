import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  findAll() {
    return `This action returns all alert`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }
}
