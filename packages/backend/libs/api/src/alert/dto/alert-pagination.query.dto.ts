import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AlertPaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  pageSize: z.string().regex(/^\d+$/).transform(Number),
  
  // 排序参数 - 支持多字段，用逗号分隔
  sortFields: z.string().optional(),
  sortOrders: z.string().optional()
    .transform(val => val?.split(',').map(order => order.toLowerCase())),
  
  // 过滤参数
  titleValue: z.string().optional(),
  serviceValue: z.string().optional(),
  incidentIdValue: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export class AlertPaginationQueryDto extends createZodDto(AlertPaginationQuerySchema) {}
