import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'


const AlertSchema = z.object({
  title: z.string(),
  content: z.string(),
  type: z.enum(['trigger', 'resolve']),
  customFields: z.record(z.unknown()).optional(),
})

export class AlertDto extends createZodDto(AlertSchema) {}
