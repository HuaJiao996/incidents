import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceRouteDto } from './create-service-route.dto';

export class UpdateServiceRouteDto extends PartialType(CreateServiceRouteDto) {}
