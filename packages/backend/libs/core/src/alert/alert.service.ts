import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreateAlertDto } from './dto/create-alert.dto';
import { get } from 'radash';
import { DatabaseService } from '@libs/database';
import { RedisService } from '@libs/redis';
import { CustomFieldValidationException } from '@libs/common/exceptions/custom-field-validation.exception';
import { RuleEngine } from '@libs/common/rengine';
import { customFieldValidators } from '@libs/common/validators/custom-field.validator';
import { AlertCreatedResponseDto } from './dto/alert-created.response.dto';
import { GlobalCustomField, ServiceCustomField } from '@prisma/client';

interface ValidationResult {
  valid: boolean;
  errors: Array<{ field: string; reason: string }>;
}

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectQueue('alertQueue') private readonly alertQueue: Queue,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  private async validateGlobalCustomFields(createAlertDto: CreateAlertDto): Promise<ValidationResult> {
    const globalCustomFields = await this.databaseService.client.globalCustomField.findMany();
    return this.validateCustomFields(createAlertDto, globalCustomFields);
  }

  private validateCustomFields(
    createAlertDto: CreateAlertDto, 
    customFields: (GlobalCustomField | ServiceCustomField)[]
  ): ValidationResult {
    const errors: { field: string; reason: string }[] = [];

    for (const customField of customFields) {
      this.logger.debug(customField);
      const fieldValue = get<unknown>(createAlertDto.customFields, customField.path);

      const validator = customFieldValidators[customField.type];
      if (!validator) {
        errors.push({
          field: customField.path,
          reason: `Unknown field type: ${customField.type}`,
        });
        continue;
      }

      const result = validator(
        customField.required,
        fieldValue,
        customField.enumValues,
      );
      if (!result.valid) {
        errors.push({
          field: customField.path,
          reason: result.reason || `Invalid value for field type: ${customField.type}`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async createAlert(createAlertDto: CreateAlertDto): Promise<AlertCreatedResponseDto> {
    const globalFieldValidation = await this.validateGlobalCustomFields(createAlertDto);
    if (!globalFieldValidation.valid) {
      throw new CustomFieldValidationException(
        globalFieldValidation.errors,
        'Global custom field validation failed',
      );
    }

    const serviceRoutes = await this.databaseService.client.serviceRoute.findMany();
    this.logger.debug(serviceRoutes);

    const engine = new RuleEngine<number>();
    serviceRoutes.forEach((serviceRoute) => {
      if (serviceRoute.condition) {
        engine.appendRule(
          serviceRoute.condition,
          serviceRoute.serviceId,
          serviceRoute.order,
        );
      }
    });

    const serviceId = await engine.run(createAlertDto);
    return this.createAlertForService(createAlertDto, serviceId, false);
  }

  async createAlertForService(
    createAlertDto: CreateAlertDto,
    serviceId?: number,
    validateGlobalFields: boolean = true,
  ): Promise<AlertCreatedResponseDto> {
    if (!serviceId) {
      throw new HttpException(
        "No matching service found",
        HttpStatus.NOT_FOUND,
      );
    }

    if (validateGlobalFields) {
      const globalFieldValidation = await this.validateGlobalCustomFields(createAlertDto);
      if (!globalFieldValidation.valid) {
        throw new CustomFieldValidationException(
          globalFieldValidation.errors,
          'Global custom field validation failed',
        );
      }
    }

    const service = await this.databaseService.client.service.findUnique({
      where: { id: serviceId },
      include: { customFields: true }
    });
      
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    const serviceFieldValidation = this.validateCustomFields(
      createAlertDto,
      service.customFields,
    );
    if (!serviceFieldValidation.valid) {
      throw new CustomFieldValidationException(
        serviceFieldValidation.errors,
        `Service (${service.name}) custom field validation failed`,
      );
    }

    const alertData = await this.databaseService.client.alert.create({
      data: {
        content: createAlertDto.content,
        title: createAlertDto.title,
        customFields: createAlertDto.customFields 
          ? JSON.parse(JSON.stringify(createAlertDto.customFields)) 
          : undefined,
        serviceId,
      },
      select: { id: true }
    });

    await this.alertQueue.add('alert', alertData.id);

    return {
      alertId: alertData.id,
      serviceId
    };
  }
}
