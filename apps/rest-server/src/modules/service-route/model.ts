import { t } from 'elysia'
import { createPaginationQuerySchema } from '@incidents/common'

export const createServiceRouteSchema = t.Object({
  serviceId: t.String({ format: 'uuid' }),
  order: t.Number(),
  condition: t.Optional(t.String({ maxLength: 1000, default: '' })),
  description: t.String({ minLength: 1, maxLength: 1000 })
})

export const updateServiceRouteSchema = t.Object({
  order: t.Optional(t.Number()),
  condition: t.Optional(t.String({ maxLength: 1000 })),
  description: t.Optional(t.String({ maxLength: 1000 }))
})

export const findAllServiceRouteQuerySchema = createPaginationQuerySchema(t.Object({
  serviceIdValue: t.Optional(t.String({ format: 'uuid' })),
  conditionValue: t.Optional(t.String({ minLength: 1 })),
  startTime: t.Optional(t.String({ format: 'date-time' })),
  endTime: t.Optional(t.String({ format: 'date-time' }))
}))

export type CreateServiceRouteDTO = typeof createServiceRouteSchema.static
export type UpdateServiceRouteDTO = typeof updateServiceRouteSchema.static
export type FindAllServiceRouteQueryDTO = typeof findAllServiceRouteQuerySchema.static