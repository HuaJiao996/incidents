import { databaseClient } from '@incidents/database'
import { status } from 'elysia'
import type {
  CreateIncidentTypeDTO,
  UpdateIncidentTypeDTO,
  FindAllIncidentTypeQueryDTO
} from './model'

export async function createIncidentType(createData: CreateIncidentTypeDTO) {
  // 检查名称是否重复
  const existingType = await databaseClient.incidentType.findFirst({
    where: { name: createData.name }
  })
  
  if (existingType) {
    throw status(409, '事件类型名称已存在')
  }

  // 创建事件类型
  const incidentType = await databaseClient.incidentType.create({
    data: {
       name: createData.name,
       condition: 'TODO',
       description: '',
       title: '',
       createdById: '',
       updatedById: '',
       serviceId: ''
    }
  })

  return incidentType
}

export async function findAllIncidentType(params: FindAllIncidentTypeQueryDTO) {
  const {
    nameValue,
    priorityValue,
    isActiveValue,
    autoAssignValue,
    startTime,
    endTime,
    page = 1,
    pageSize = 10,
    sortFields = 'createdAt',
    sortOrders = 'desc'
  } = params

  const where: any = {}
  
  if (nameValue) {
    where.name = {
      contains: nameValue,
      mode: 'insensitive'
    }
  }
  
  if (priorityValue) {
    where.priority = priorityValue
  }
  
  if (isActiveValue !== undefined) {
    where.isActive = isActiveValue
  }
  
  if (autoAssignValue !== undefined) {
    where.autoAssign = autoAssignValue
  }

  if (startTime || endTime) {
    where.createdAt = {}
    if (startTime) {
      where.createdAt.gte = new Date(startTime)
    }
    if (endTime) {
      where.createdAt.lte = new Date(endTime)
    }
  }

  const orderBy = sortFields.split(',').map((field, index) => ({
    [field]: sortOrders[index] || 'desc'
  }))

  const [data, total] = await Promise.all([
    databaseClient.incidentType.findMany({
      where,
      include: {
        _count: {
          select: {
            incidents: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    databaseClient.incidentType.count({ where })
  ])

  return {
    data,
    total,
    page,
    limit: pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

export async function findIncidentTypeById(id: number) {
  const incidentType = await databaseClient.incidentType.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          incidents: true
        }
      }
    }
  })
  
  if (!incidentType) {
    throw status(404, '事件类型不存在')
  }

  return incidentType
}

export async function updateIncidentType(id: number, data: UpdateIncidentTypeDTO) {
  // 检查事件类型是否存在
  const existingType = await databaseClient.incidentType.findUnique({
    where: { id }
  })
  
  if (!existingType) {
    throw status(404, '事件类型不存在')
  }

  // 如果更新了名称，检查是否重复
  if (data.name && data.name !== existingType.name) {
    const duplicateType = await databaseClient.incidentType.findFirst({
      where: {
        name: data.name,
        id: { not: id }
      }
    })
    
    if (duplicateType) {
      throw status(409, '事件类型名称已存在')
    }
  }

  // 更新事件类型
  const updatedType = await databaseClient.incidentType.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          incidents: true
        }
      }
    }
  })

  return updatedType
}

export async function deleteIncidentType(id: number) {
  // 检查事件类型是否存在
  const existingType = await databaseClient.incidentType.findUnique({
    where: { id }
  })
  
  if (!existingType) {
    throw status(404, '事件类型不存在')
  }

  // 检查是否有关联的事件
  const relatedIncidents = await databaseClient.incident.count({
    where: { typeId: id }
  })
  
  if (relatedIncidents > 0) {
    throw status(409, '该事件类型已被使用，无法删除')
  }

  // 删除事件类型
  await databaseClient.incidentType.delete({
    where: { id }
  })
}