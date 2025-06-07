import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateAlertSchema = z.object({
  title: z.string(),
  content: z.string(),
  customFields: z.record(z.unknown()).optional(),
});

export class CreateAlertDto extends createZodDto(CreateAlertSchema) {}
