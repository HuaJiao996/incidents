import { databaseClient, type AlertOrderByWithRelationInput, type AlertWhereInput } from '@incidents/database'
import { addAlertJob } from '@incidents/queue'
import { RuleEngine } from '@incidents/common'

import type { CreateAlertDTO, FindAllAlertQueryDTO } from './model'
import { status } from 'elysia';
import { validateCustomFields, validateGlobalCustomFields } from './utils';
import { logger } from '@incidents/common';
import { all } from 'radash';

export async function findAllAlert(query: FindAllAlertQueryDTO) {
  const {
      page,
      pageSize,
      sortFields,
      sortOrders,
      title,
      serviceId,
      incidentId,
      startTime,
      endTime,
    } = query;

    const where: AlertWhereInput = {};

    // 处理过滤条件
    if (title) {
      where.title = {
        contains: title,
      };
    }

    if (serviceId) {
      where.service = {
        id: serviceId 
      };
    }

    if (incidentId) {
      where.incidentId = incidentId;
    }

    // 处理时间范围
    if (startTime || endTime) {
      where.createdAt = {
        ...(startTime && { gte: startTime }),
        ...(endTime && { lte: endTime }),
      };
    }

    // 处理多字段排序
    let orderBy: AlertOrderByWithRelationInput[] = [
      {
        createdAt: 'desc', // 默认排序
      },
    ];

    if (sortFields) {
      const fields = sortFields.split(',');
      const orders = sortOrders || fields.map(() => 'asc');

      orderBy = fields.map((field, index) => ({
        [field.trim()]: orders[index] || 'asc',
      }));
    }

    const [alerts, total] = await all([
      databaseClient.alert.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy,
        include: {
          service: true,
        },
      }),
      databaseClient.alert.count({
        where,
      }),
    ]);

    return {
      page,
      pageSize,
      data: alerts,
      total,
    };
}

export async function createAlert(apiKey: string, createAlertDto: CreateAlertDTO) {
  const globalFieldValidation =
      await validateGlobalCustomFields(createAlertDto);
    if (!globalFieldValidation.valid) {
      return status(400, {
        message: 'Global custom field validation failed',
        errors: globalFieldValidation.errors
      })
    }

    const serviceRoutes =
      await databaseClient.serviceRoute.findMany();
    logger.debug(serviceRoutes);

    const engine = new RuleEngine<string>();
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
    if (!serviceId) {
    return status(404, 'No matching service found');
  }
    return createAlertForService(apiKey, serviceId, createAlertDto, false);
}

export async function createAlertForService(apiKey: string, serviceId: string, createAlertDto: CreateAlertDTO, validateGlobalFields: boolean = true,) {
  const service = await databaseClient.service.findUnique({
      where: { id: serviceId },
      include: { customFields: true },
  });

  if (!service) {
    return status(404, 'No matching service found');
  }
  if (validateGlobalFields) {
      const globalFieldValidation =
        await validateGlobalCustomFields(createAlertDto);
      if (!globalFieldValidation.valid) {
        return status(400, {
        message: 'Global custom field validation failed',
        errors: globalFieldValidation.errors
      })
      }
    }
    

    const serviceFieldValidation = validateCustomFields(
      createAlertDto,
      service.customFields,
    );
    if (!serviceFieldValidation.valid) {
      return status(400, {
        message: `Service (${service.name}) custom field validation failed`,
        errors: serviceFieldValidation.errors
      })
    }

    const alertData = await databaseClient.alert.create({
      data: {
        content: createAlertDto.content,
        title: createAlertDto.title,
        customFields: createAlertDto.customFields
          ? JSON.parse(JSON.stringify(createAlertDto.customFields))
          : undefined,
        serviceId,
        createdById: apiKey
      },
      select: { id: true },
    });

    await addAlertJob(alertData.id) ;

    return {
      alertId: alertData.id,
      serviceId,
    };
}


