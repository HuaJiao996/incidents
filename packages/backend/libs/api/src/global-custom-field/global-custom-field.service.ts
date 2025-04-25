import { Injectable } from '@nestjs/common';
import { CreateGlobalCustomFieldDto } from './dto/create-global-custom-field.dto';
import { UpdateGlobalCustomFieldDto } from './dto/update-global-custom-field.dto';

@Injectable()
export class GlobalCustomFieldService {
  create(createGlobalCustomFieldDto: CreateGlobalCustomFieldDto) {
    return 'This action adds a new globalCustomField';
  }

  findAll() {
    return `This action returns all globalCustomField`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globalCustomField`;
  }

  update(id: number, updateGlobalCustomFieldDto: UpdateGlobalCustomFieldDto) {
    return `This action updates a #${id} globalCustomField`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalCustomField`;
  }
}
