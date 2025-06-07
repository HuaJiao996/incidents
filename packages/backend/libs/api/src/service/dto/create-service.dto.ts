import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export class CreateServiceDto extends createZodDto(createServiceSchema) {}
