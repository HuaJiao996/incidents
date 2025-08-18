import { databaseClient as db, type ServiceRouteWhereInput, type ServiceRouteOrderByWithRelationInput } from '@incidents/database'
import { status } from 'elysia'
import type { CreateServiceRouteDTO, UpdateServiceRouteDTO, FindAllServiceRouteQueryDTO } from './model'

export async function createServiceRoute(userId: string, createServiceRouteDto: CreateServiceRouteDTO): Promise<string> {
  // 验证服务是否存在
  const service = await db.service.findUnique({
    where: { id: createServiceRouteDto.serviceId }
  })

  if (!service) {
    throw status(404, 'Service not found')
  }

  // 检查是否已存在相同的条件
  const existingRoute = await db.serviceRoute.findFirst({
    where: {
      serviceId: createServiceRouteDto.serviceId,
      condition: createServiceRouteDto.condition || ''
    }
  })

  if (existingRoute) {
    throw status(400, 'Route with same condition already exists for this service')
  }

  const serviceRoute = await db.serviceRoute.create({
    data: {
      ...createServiceRouteDto,
      condition: createServiceRouteDto.condition || '',
      createdById: userId,
      updatedById: userId
    },
    select: {
      id: true
    }
  })

  return serviceRoute.id.toString()
}

export async function findAllServiceRoute(query: FindAllServiceRouteQueryDTO) {
  const {
    page = 1,
    pageSize = 10,
    sortFields,
    sortOrders,
    serviceIdValue,
    conditionValue,
    startTime,
    endTime
  } = query

  // 构建过滤条件
  const where: ServiceRouteWhereInput = {}
  if (serviceIdValue) {
    where.serviceId = serviceIdValue
  }
  if (conditionValue) {
    where.condition = { contains: conditionValue }
  }

  // 处理时间范围
  if (startTime || endTime) {
    where.createdAt = {}
    if (startTime) {
      where.createdAt.gte = new Date(startTime)
    }
    if (endTime) {
      where.createdAt.lte = new Date(endTime)
    }
  }

  // 构建排序条件
  const orderBy: ServiceRouteOrderByWithRelationInput[] = []
  if (sortFields && sortOrders) {
    const fieldsArray = Array.isArray(sortFields) ? sortFields : [sortFields]
    const ordersArray = Array.isArray(sortOrders) ? sortOrders : [sortOrders]
    fieldsArray.forEach((field: string, index: number) => {
      const order = ordersArray[index] || 'asc'
      orderBy.push({ [field]: order })
    })
  } else {
    orderBy.push({ createdAt: 'desc' })
  }

  const [data, total] = await Promise.all([
    db.serviceRoute.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    db.serviceRoute.count({ where })
  ])

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

export async function findServiceRouteById(id: string) {
  const serviceRoute = await db.serviceRoute.findUnique({
    where: { id: parseInt(id) },
    include: {
      service: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!serviceRoute) {
    throw status(404, 'Service route not found')
  }

  return serviceRoute
}

export async function updateServiceRoute(userId: string, id: string, updateServiceRouteDto: UpdateServiceRouteDTO) {
  // 验证服务路由是否存在
  const existingRoute = await db.serviceRoute.findUnique({
    where: { id: parseInt(id) }
  })

  if (!existingRoute) {
    throw status(404, 'Service route not found')
  }

  // 如果更新了条件，检查是否与其他路由冲突
  if (updateServiceRouteDto.condition) {
    const conflictingRoute = await db.serviceRoute.findFirst({
      where: {
        serviceId: existingRoute.serviceId,
        condition: updateServiceRouteDto.condition,
        NOT: { id: parseInt(id) }
      }
    })

    if (conflictingRoute) {
      throw status(400, 'Route with same condition already exists for this service')
    }
  }

  const updatedRoute = await db.serviceRoute.update({
    where: { id: parseInt(id) },
    data: updateServiceRouteDto,
    include: {
      service: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return updatedRoute
}

export async function deleteServiceRoute(userId: string, id: string) {
  const serviceRoute = await db.serviceRoute.findUnique({
    where: { id: parseInt(id) }
  })

  if (!serviceRoute) {
    throw status(404, 'Service route not found')
  }

  await db.serviceRoute.delete({
    where: { id: parseInt(id) }
  })

  return { success: true }
}