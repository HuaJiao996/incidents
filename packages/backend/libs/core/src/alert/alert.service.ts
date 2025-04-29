import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AlertDto } from './dto/alert.dto';
import { alertTable, GlobalCustomField, ServiceCustomField } from '@libs/database/schema';
import { get } from 'radash';
import { DatabaseService } from '@libs/database';
import { RedisService } from '@libs/redis';
import { CustomFieldValidationException } from '@libs/common/exceptions/custom-field-validation.exception';
import { RuleEngine } from '@libs/common/rule-engine/rule-engine';
import { customFieldValidators } from '@libs/common/validators/custom-field.validator';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectQueue('alertQueue') private readonly alertQueue: Queue,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  private async checkGlobalCustomField(alertDto: AlertDto) {
    const globalCustomFields = await this.databaseService
      .getClient()
      .query.globalCustomFieldTable.findMany();
    return this.checkCustomField(alertDto, globalCustomFields);
  }

  private checkCustomField(alertDto: AlertDto, customFields: (GlobalCustomField | ServiceCustomField)[]) {
    const errors: { field: string; reason: string }[] = [];

    for (const customField of customFields) {
      this.logger.debug(customField);
      const fieldValue = get<unknown>(alertDto.customFields, customField.path);

      // 使用验证器检查类型
      const matcher = customFieldValidators[customField.type];
      if (!matcher) {
        errors.push({
          field: customField.path,
          reason: `Unknown field type: ${customField.type}`,
        });
        continue;
      }

      const result = matcher(
        customField.required,
        fieldValue,
        customField.enumValues,
      );
      if (!result.valid) {
        errors.push({
          field: customField.path,
          reason: `${result.reason}`,
        });
        continue;
      }

      this.logger.debug(fieldValue);
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  async receive(alertDto: AlertDto) {
    const globalFieldCheck = await this.checkGlobalCustomField(alertDto);
    if (!globalFieldCheck.valid) {
      throw new CustomFieldValidationException(
        globalFieldCheck.errors,
        'Global custom field validation failed',
      );
    }
    const serviceRoutes = await this.databaseService
      .getClient()
      .query.serviceRouteTable.findMany({
        orderBy: (serviceRoute, { asc }) => [asc(serviceRoute.order)],
      });

    const engine = new RuleEngine();
    serviceRoutes.forEach((serviceRoute) => {
      engine.appendRule(
        serviceRoute.condition,
        { serviceId: serviceRoute.serviceId },
        serviceRoute.order,
      );
    });
    const serviceId = await engine
      .run(alertDto)
      .then(({ events }) => events[0]?.params?.serviceId as string | undefined);
    return this.receiveWithServiceId(alertDto, serviceId, false);
  }

  async receiveWithServiceId(
    alertDto: AlertDto,
    serviceId?: string,
    checkGlobalCustomField: boolean = true,
  ) {
    if (!serviceId) {
      throw new HttpException(
        "Don't matched any service",
        HttpStatus.NOT_FOUND,
      );
    }

    if (checkGlobalCustomField) {
      const globalFieldCheck = await this.checkGlobalCustomField(alertDto);
      if (!globalFieldCheck.valid) {
        throw new CustomFieldValidationException(
          globalFieldCheck.errors,
          'Global custom field validation failed',
        );
      }
    }

    const service = await this.databaseService
      .getClient()
      .query.serviceTable.findFirst({
        where: (service, { eq }) => eq(service.id, serviceId),
        with: {
          customFields: true,
        },
      });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    const serviceFieldCheck = this.checkCustomField(
      alertDto,
      service.customFields,
    );
    if (!serviceFieldCheck.valid) {
      throw new CustomFieldValidationException(
        serviceFieldCheck.errors,
        `Service (${service.name}) custom field validation failed`,
      );
    }

    const alertData = await this.databaseService
      .getClient()
      .insert(alertTable)
      .values({
        content: alertDto.content,
        title: alertDto.title,
        customFields: alertDto.customFields,
        serviceId: serviceId,
        type: alertDto.type,
      })
      .returning({ id: alertTable.id });

    const alertId = alertData[0].id;

    await this.alertQueue.add('alert', alertId);

    // return {
    //     alertId,
    //     serviceId,
    // }
  }
}
