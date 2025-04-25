import { NewService } from '@libs/database/schema';

export class CreateServiceDto implements NewService {
  name: string;
}
