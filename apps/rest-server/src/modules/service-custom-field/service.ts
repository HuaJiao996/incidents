import { databaseClient as db } from '@incidents/database'
import { status } from 'elysia'
import type {
  CreateServiceCustomFieldDTO,
  UpdateServiceCustomFieldDTO,
  FindAllServiceCustomFieldQueryDTO
} from './model'

export async function createServiceCustomField(data: CreateServiceCustomFieldDTO, userId: string = 'system') {
  // 检查服务是否存在
  const service = await db.service.findUnique({
    where: { id: data.serviceId }
  })
  
  if (!service) {
    throw status(404, '服务不存在')
  }

  // 检查同一服务下字段名是否重复
  const existingField = await db.serviceCustomField.findFirst({
    where: {
      serviceId: data.serviceId,
      path: data.path
    }
  })
  
  if (existingField) {
    throw status(409, '该服务下已存在同名字段')
  }

  // 创建自定义字段
  const serviceCustomField = await db.serviceCustomField.create({
    data: {
      ...data,
      enumValues: data.options || [],
      createdById: userId,
      updatedById: userId
    },
    include: {
      service: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return serviceCustomField
}

export async function findAllServiceCustomField(params: FindAllServiceCustomFieldQueryDTO) {
  const {
    serviceIdValue,
    nameValue,
    typeValue,
    requiredValue,
    startTime,
    endTime,
    page = 1,
    pageSize = 10,
    sortFields = ['createdAt'],
    sortOrders = ['desc']
  } = params

  const where: any = {}
  
  if (serviceIdValue) {
    where.serviceId = serviceIdValue
  }
  
  if (nameValue) {
    where.name = {
      contains: nameValue,
      mode: 'insensitive'
    }
  }
  
  if (typeValue) {
    where.type = typeValue
  }
  
  if (requiredValue !== undefined) {
    where.required = requiredValue
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

  const sortFieldsArray = Array.isArray(sortFields) ? sortFields : sortFields ? sortFields.split(',') : ['createdAt']
  const sortOrdersArray = Array.isArray(sortOrders) ? sortOrders : sortOrders ? sortOrders.split(',') : ['desc']
  
  const orderBy = sortFieldsArray.map((field: string, index: number) => ({
    [field]: sortOrdersArray[index] || 'desc'
  }))

  const [data, total] = await Promise.all([
    db.serviceCustomField.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * pageSize,
    take: pageSize,    }),
    db.serviceCustomField.count({ where })
  ])

  return {
    data,
    total,
    page,
    limit: pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

export async function findServiceCustomFieldById(id: string) {
  const serviceCustomField = await db.serviceCustomField.findUnique({
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
  
  if (!serviceCustomField) {
    throw status(404, '服务自定义字段不存在')
  }

  return serviceCustomField
}

export async function updateServiceCustomField(id: string, data: UpdateServiceCustomFieldDTO) {
  // 检查字段是否存在
  const existingField = await db.serviceCustomField.findUnique({
    where: { id: parseInt(id) }
  })
  
  if (!existingField) {
    throw status(404, '服务自定义字段不存在')
  }

  // 如果更新了字段名，检查同一服务下是否重复
  if (data.path && data.path !== existingField.path) {
    const duplicateField = await db.serviceCustomField.findFirst({
      where: {
        serviceId: existingField.serviceId,
        path: data.path,
        id: { not: parseInt(id) }
      }
    })
    
    if (duplicateField) {
      throw status(409, '该服务下已存在同名字段')
    }
  }

  // 更新字段
  const updatedField = await db.serviceCustomField.update({
    where: { id: parseInt(id) },
    data,
    include: {
      service: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return updatedField
}

export async function deleteServiceCustomField(id: string) {
  // 检查字段是否存在
  const existingField = await db.serviceCustomField.findUnique({
    where: { id: parseInt(id) }
  })
  
  if (!existingField) {
    throw status(404, '服务自定义字段不存在')
  }

  // 检查是否有关联的自定义字段值
  const relatedValues = await db.serviceCustomField.count({
    where: { id: parseInt(id) }
  })
  
  if (relatedValues > 0) {
    throw status(409, '该字段已被使用，无法删除')
  }

  // 删除字段
  await db.serviceCustomField.delete({
    where: { id: parseInt(id) }
  })
}