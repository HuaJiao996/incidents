import { PaginationQuerySchema } from '@libs/common/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const IncidentPaginationQuerySchema = PaginationQuerySchema.extend({
  // 过滤参数
  titleValue: z.string().optional(),
  serviceValue: z.string().optional(), // 多选，逗号分隔
  incidentIdValue: z.string().optional(),
  statusValue: z.string().optional(), // 多选，逗号分隔
  assigneeValue: z.string().optional(), // 多选，逗号分隔
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  updatedAtStart: z.string().optional(),
  updatedAtEnd: z.string().optional(),
});

export class IncidentPaginationQueryDto extends createZodDto(IncidentPaginationQuerySchema) {}
