import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const AlertPaginationParamsSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  pageSize: z.string().regex(/^\d+$/).transform(Number),
});

export class AlertPaginationParamsDto extends createZodDto(
  AlertPaginationParamsSchema,
) {}
