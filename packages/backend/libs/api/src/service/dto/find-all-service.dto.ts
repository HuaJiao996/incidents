import { PaginationQuerySchema } from '@libs/common/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FindAllServiceQuerySchema = PaginationQuerySchema.extend({
  // 过滤参数
  idValue: z.string().optional(),
  nameValue: z.string().optional(),
  descriptionValue: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export class FindAllServiceDto extends createZodDto(FindAllServiceQuerySchema) {} 