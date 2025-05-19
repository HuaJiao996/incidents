import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginationQuerySchema } from '@libs/common/dto';

export const AlertPaginationQuerySchema = PaginationQuerySchema.extend({
  titleValue: z.string().optional(),
  serviceValue: z.string().optional(),
  incidentIdValue: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export class AlertPaginationQueryDto extends createZodDto(AlertPaginationQuerySchema) {}
