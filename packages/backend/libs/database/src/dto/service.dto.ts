import { Service } from '@prisma/client';

export class ServiceDto implements Service {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}