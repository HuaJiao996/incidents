import { databaseClient, type IncidentStatus, type IncidentOrderByWithRelationInput, type IncidentWhereInput } from '@incidents/database'
import type { FindAllIncidentQueryDto } from './model'

export async function findAllIncidents(query: FindAllIncidentQueryDto) {
  const {
    page,
    pageSize,
    sortFields,
    sortOrders,
    titleValue,
    serviceValue,
    incidentIdValue,
    statusValue,
    startTime,
    endTime,
    updatedAtStart,
    updatedAtEnd,
  } = query

  const where: IncidentWhereInput = {}

  if (titleValue) {
    where.title = { contains: titleValue }
  }

  if (serviceValue) {
    const serviceIds = serviceValue.split(',')
    if (serviceIds.length > 0) {
      where.serviceId = { in: serviceIds }
    }
  }

  if (incidentIdValue) {
    where.id = { equals: parseInt(incidentIdValue) }
  }

  if (statusValue) {
    const statuses = statusValue.split(',').filter(Boolean) as IncidentStatus[]
    if (statuses.length > 0) {
      where.status = { in: statuses }
    }
  }

  // 创建时间范围
  if (startTime || endTime) {
    where.createdAt = {}
    if (startTime) {
      where.createdAt.gte = new Date(startTime)
    }
    if (endTime) {
      where.createdAt.lte = new Date(endTime)
    }
  }

  // 更新时间范围
  if (updatedAtStart || updatedAtEnd) {
    where.updatedAt = {}
    if (updatedAtStart) {
      where.updatedAt.gte = new Date(updatedAtStart)
    }
    if (updatedAtEnd) {
      where.updatedAt.lte = new Date(updatedAtEnd)
    }
  }

  const orderBy: IncidentOrderByWithRelationInput[] = []
  if (sortFields && sortOrders) {
    const fields = (sortFields || '').toString().split(',')
    const orders = (sortOrders || '').toString().split(',')
    fields.forEach((field, index) => {
      if (orders[index]) {
        orderBy.push({ [field]: orders[index] })
      }
    })
  }

  const incidents = await databaseClient.incident.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      service: true,
      type: true,
    },
  })

  const total = await databaseClient.incident.count({
    where,
  })

  return {
    data: incidents,
    total,
    page,
    pageSize,
  }
}
