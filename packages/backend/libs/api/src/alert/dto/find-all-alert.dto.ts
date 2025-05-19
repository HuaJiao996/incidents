import { PaginationQuerySchema } from '@libs/common/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FindAllAlertQuerySchema = PaginationQuerySchema.extend({
  titleValue: z.string().optional(),
  serviceValue: z.string().optional(),
  incidentIdValue: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export class FindAllAlertDto extends createZodDto(FindAllAlertQuerySchema) {} 