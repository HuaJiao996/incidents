import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GlobalCustomFieldService } from './global-custom-field.service';
import { CreateGlobalCustomFieldDto } from './dto/create-global-custom-field.dto';
import { UpdateGlobalCustomFieldDto } from './dto/update-global-custom-field.dto';

@Controller('global-custom-field')
export class GlobalCustomFieldController {
  constructor(
    private readonly globalCustomFieldService: GlobalCustomFieldService,
  ) {}

  @Post()
  create(@Body() createGlobalCustomFieldDto: CreateGlobalCustomFieldDto) {
    return this.globalCustomFieldService.create(createGlobalCustomFieldDto);
  }

  @Get()
  findAll() {
    return this.globalCustomFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalCustomFieldService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGlobalCustomFieldDto: UpdateGlobalCustomFieldDto,
  ) {
    return this.globalCustomFieldService.update(
      +id,
      updateGlobalCustomFieldDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalCustomFieldService.remove(+id);
  }
}
