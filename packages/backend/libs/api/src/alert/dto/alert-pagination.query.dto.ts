import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const AlertPaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  pageSize: z.string().regex(/^\d+$/).transform(Number),
  title: z.string().optional(),
  service: z.string().optional(),
  dateRange: z.array(z.date()).length(2).optional(),
  orderBy: z.string().optional(),
});

export class AlertPaginationQueryDto extends createZodDto(
  AlertPaginationQuerySchema,
) {}
