import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AlertDto } from './dto/alert.dto';
import { TopLevelCondition } from 'json-rules-engine';
import { alert } from '../database/schema';
import { CustomFieldDto } from './dto/custom-field.dto';
import { get, isNumber, isString } from 'radash';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
import { CustomFieldValidationException } from '../common/exceptions/custom-field-validation.exception';
import { RuleEngine } from '../common/rule-engine/rule-engine';
const baseValidator = (required: boolean, fieldValue: unknown, typeCheck: (value: unknown) => boolean, typeName: string) => {
    if (fieldValue === undefined || fieldValue === null) {
        return required 
            ? { valid: false, reason: 'Required field is missing' }
            
            : { valid: true };
    }
    return typeCheck(fieldValue)
        ? { valid: true }
        : { valid: false, reason: `Value "${JSON.stringify(fieldValue)}" is not of type ${typeName}` };
}
// 简化后的自定义字段验证器
const customFieldValidators = {
    
    string: (required: boolean, fieldValue?: unknown) => 
        baseValidator(required, fieldValue, isString, 'string'),
    
    number: (required: boolean, fieldValue?: unknown) => 
        baseValidator(required, fieldValue, isNumber, 'number'),
    
    boolean: (required: boolean, fieldValue?: unknown) => 
        baseValidator(required, fieldValue, 
            value => typeof value === 'boolean', 'boolean'),
    
    array: (required: boolean, fieldValue?: unknown) => {
        // 先检查是否为数组
        const arrayCheck = baseValidator(
            required, fieldValue, Array.isArray, 'array');
        
        if (!arrayCheck.valid) return arrayCheck;
        
        // 如果是必填，检查数组是否为空
        if (required && (fieldValue as unknown[]).length === 0) {
            return { valid: false, reason: 'Array cannot be empty' };
        }
        
        return { valid: true };
    },
    
    enum: (required: boolean, fieldValue?: unknown, enumValues?: unknown[]) => {
        // 先检查字段值是否存在
        if (fieldValue === undefined || fieldValue === null) {
            return required 
                ? { valid: false, reason: 'Required field is missing' } 
                : { valid: true };
        }
        
        // 检查枚举值列表是否有效
        if (!Array.isArray(enumValues) || enumValues.length === 0) {
            return { valid: false, reason: 'Invalid enum values list' };
        }
        
        // 检查值是否在枚举列表中
        return enumValues.includes(fieldValue)
            ? { valid: true }
            : { valid: false, reason: `Value "${fieldValue}" is not in allowed enum values [${enumValues.join(', ')}]` };
    }
};

@Injectable()
export class AlertService {

    private readonly logger = new Logger(AlertService.name);

    constructor(@InjectQueue('alert') private readonly alertQueue: Queue, private readonly databaseService: DatabaseService, private readonly redisService: RedisService) {

    }

    private async checkGlobalCustomField(alertDto: AlertDto) {
        const globalCustomeFields = await this.databaseService.getClient().query.globalCustomField.findMany();
        return this.checkCustomField(alertDto, globalCustomeFields);
    }

    private checkCustomField(alertDto: AlertDto, customFields: CustomFieldDto[]) {
        const errors: { field: string; reason: string }[] = [];
        
        for (const customField of customFields) {
            this.logger.debug(customField);
            const fieldValue = get<unknown>(alertDto.customFields, customField.path);
            
            // 使用验证器检查类型
            const matcher = customFieldValidators[customField.type];
            if (!matcher) {
                errors.push({
                    field: customField.path,
                    reason: `未知的字段类型: ${customField.type}`,
                });
                continue;
            }
            
            const result = matcher(customField.required, fieldValue, customField.enumValues);
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

    async recive(alertDto: AlertDto) {
        const globalFieldCheck = await this.checkGlobalCustomField(alertDto);
        if (!globalFieldCheck.valid) {
            throw new CustomFieldValidationException(
                globalFieldCheck.errors,
                "Global custom field validation failed"
            );
        }
        const serviceRoutes = await this.databaseService.getClient().query.serviceRoute.findMany({ orderBy: (serviceRoute, { asc }) => [asc(serviceRoute.order)], });

        const engine = new RuleEngine;
        serviceRoutes.forEach((serviceRoute) => {
            engine.appendRule(serviceRoute.condition as TopLevelCondition,{ serviceId: serviceRoute.serviceId }, serviceRoute.order)
        })

        const serviceId = await engine.run(alertDto).then(({ events }) => events[0]?.params?.serviceId as (string | undefined));
        return this.reciveWithServiceId(alertDto, serviceId, false);
    }


    async reciveWithServiceId(alertDto: AlertDto, serviceId?: string, checkGlobalCustomField: boolean = true) {
        if (!serviceId) {
            throw new HttpException("Don't matched any service", HttpStatus.NOT_FOUND);
        }

        if (checkGlobalCustomField) {
            const globalFieldCheck = await this.checkGlobalCustomField(alertDto);
            if (!globalFieldCheck.valid) {
                throw new CustomFieldValidationException(
                    globalFieldCheck.errors,
                    "Global custom field validation failed"
                );
            }
        }

        const service = await this.databaseService.getClient().query.service.findFirst({ 
            where: (service, { eq }) => eq(service.id, serviceId),
            with: {
                customeFields: true,
            }
        });

        if (!service) {
            throw new HttpException("Service not found", HttpStatus.NOT_FOUND);
        }

        const serviceFieldCheck = this.checkCustomField(alertDto, service.customeFields, );
        if (!serviceFieldCheck.valid) {
            throw new CustomFieldValidationException(
                serviceFieldCheck.errors,
               `Service (${service.name}) custom field validation failed`
            );
        }

        const alertData = await this.databaseService.getClient().insert(alert)
        .values({
           content: alertDto.content,
           title: alertDto.title,
           customFields: alertDto.customFields,
           serviceId: serviceId,
           type: alertDto.type,
        }).returning({id: alert.id});

        const alertId = alertData[0].id;

        await this.alertQueue.add('alert', alertId);

        // return {
        //     alertId,
        //     serviceId,
        // }
    }
}
