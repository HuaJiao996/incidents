import { status } from 'elysia'
import { databaseClient, type GlobalCustomFieldWhereInput } from '@incidents/database'
import type {
  CreateGlobalCustomFieldDTO,
  UpdateGlobalCustomFieldDTO,
  FindAllGlobalCustomFieldQueryDTO,
} from './model'
import { all } from 'radash'

export async function createGlobalCustomField(userId: string, createData: CreateGlobalCustomFieldDTO) {
  // 检查字段名是否已存在
  const existingField = await databaseClient.globalCustomField.findFirst({
    where: {
      path: createData.path,
    },
  })

  if (existingField) {
    throw status(409, 'Global custom field with this name already exists in this scope')
  }

  const globalCustomField = await databaseClient.globalCustomField.create({
    data: {
      path: createData.path,
      type: createData.type,
      createdById: userId,
      updatedById: userId,
    },
  })

  return globalCustomField
}

export async function findAllGlobalCustomField(query: FindAllGlobalCustomFieldQueryDTO) {
  const {
    page = 1,
    pageSize = 10,
    path,
    type,
    required,
    startTime,
    endTime,
    sortFields = 'createdAt',
    sortOrders = 'desc',
  } = query

  const skip = (page - 1) * pageSize
  const where: GlobalCustomFieldWhereInput = {}

  if (path) {
    where.path = {
      contains: path,
      mode: 'insensitive',
    }
  }

  if (type) {
    where.type = type
  }

  if (required !== undefined) {
    where.required = required
  }

  // 时间范围过滤
  if (startTime || endTime) {
    where.createdAt = {}
    if (startTime) {
      where.createdAt.gte = startTime
    }
    if (endTime) {
      where.createdAt.lte = endTime
    }
  }

  // 构建排序条件
  const orderBy = sortFields.split(',').map((field, index) => ({
    [field]: sortOrders[index] || 'desc',
  }))

  const [globalCustomFields, total] = await all([
    databaseClient.globalCustomField.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    }),
    databaseClient.globalCustomField.count({ where }),
  ])

  return {
    data: globalCustomFields,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

export async function findGlobalCustomFieldById(id: number) {
  const globalCustomField = await databaseClient.globalCustomField.findUnique({
    where: { id },
  })

  if (!globalCustomField) {
    throw status(404, 'Global custom field not found')
  }

  return globalCustomField
}

export async function updateGlobalCustomField(userId: string, id: number, data: UpdateGlobalCustomFieldDTO) {
  // 检查字段是否存在
  const existingField = await databaseClient.globalCustomField.findUnique({
    where: { id },
  })

  if (!existingField) {
    throw status(404, 'Global custom field not found')
  }

  // 如果更新名称，检查是否与其他字段冲突
  if (data.path && data.path !== existingField.path) {
    const duplicateField = await databaseClient.globalCustomField.findFirst({
      where: {
        path: data.path,
        id: { not: id },
      },
    })

    if (duplicateField) {
      throw status(409, 'Global custom field with this name already exists in this scope')
    }
  }

  const updatedField = await databaseClient.globalCustomField.update({
    where: { id },
    data: {
      path: data.path,
      type: data.type,
      required: data.required,
      enumValues: data.enumValues,
      updatedById: userId
    },
  })

  return updatedField
}

export async function deleteGlobalCustomField(id: number) {
  const existingField = await databaseClient.globalCustomField.findUnique({
    where: { id },
  })

  if (!existingField) {
    throw status(404, 'Global custom field not found')
  }

  // 检查是否有关联的数据使用此字段
  // 这里可以添加更多的关联检查逻辑

  await databaseClient.globalCustomField.delete({
    where: { id },
  })
}
