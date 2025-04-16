import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AlertDto } from './dto/alert.dto';
import { Engine, TopLevelCondition } from 'json-rules-engine';
import { alert } from 'src/database/schema';
import { CustomFieldDto } from './dto/custom-field.dto';
import { get } from 'radash';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AlertService {

    constructor(@InjectQueue('alert') private readonly alertQueue: Queue, private readonly databaseService: DatabaseService, private readonly redisService: RedisService) {

    }

    private async checkGlobalCustomField(alertDto: AlertDto) {
        const globalCustomeFields = await this.databaseService.getClient().query.globalCustomField.findMany();
        this.checkCustomField(alertDto, globalCustomeFields);
        return true;
    }

    private checkCustomField(alertDto: AlertDto, customFields: CustomFieldDto[]) {
        for (const customField of customFields) {
            const fieldValue = get<unknown>(alertDto, customField.path);
            if (customField.required && (!fieldValue || !(fieldValue as unknown[]).length)) {
                return false;
            }
            const typeMatchers = {
                string: typeof fieldValue === 'string',
                number: typeof fieldValue === 'number',
                boolean: typeof fieldValue === 'boolean',
                array: Array.isArray(fieldValue),
                enum: customField.enumValues.includes(fieldValue),
            }
            if (!typeMatchers[customField.type]) {
                return false;
            }
        }
        return true;
    }

    async recive(alertDto: AlertDto) {
        if (!await this.checkGlobalCustomField(alertDto)) {
            throw new HttpException("Global custom field is not valid", HttpStatus.BAD_REQUEST);
        }
        const serviceRoutes = await this.databaseService.getClient().query.serviceRoute.findMany({ orderBy: (serviceRoute, { asc }) => [asc(serviceRoute.order)], });

        const engine = new Engine;
        serviceRoutes.forEach((serviceRoute) => {
            engine.addRule({
                conditions: serviceRoute.condition as TopLevelCondition,
                event: { type: 'matched', params: { serviceId: serviceRoute.serviceId } },
                priority: serviceRoute.order,
            })
        })
        engine.on('matched', () => {
            engine.stop();
        })
        const serviceId = await engine.run(alertDto).then(({ events }) => events[0]?.params?.serviceId as (string | undefined));
        return this.reciveWithServiceId(alertDto, serviceId);
    }


    async reciveWithServiceId(alertDto: AlertDto, serviceId?: string) {
        if (!serviceId) {
            throw new HttpException("Don't matched any service", HttpStatus.NOT_FOUND);
        }

        if (!await this.checkGlobalCustomField(alertDto)) {
            throw new HttpException("Global custom field is not valid", HttpStatus.BAD_REQUEST);
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

        if (!this.checkCustomField(alertDto, service.customeFields)) {
            throw new HttpException("Service custom field is not valid", HttpStatus.BAD_REQUEST);
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

        return {
            alertId,
            serviceId,
        }
    }
}
