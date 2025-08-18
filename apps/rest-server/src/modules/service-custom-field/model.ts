import { t } from 'elysia'
import { createPaginationQuerySchema } from '@incidents/common'

export const createServiceCustomFieldSchema = t.Object({
  serviceId: t.String({ format: 'uuid' }),
  path: t.String({ minLength: 1, maxLength: 100 }),
  type: t.Union([
    t.Literal('STRING'),
    t.Literal('NUMBER'),
    t.Literal('BOOLEAN'),
    t.Literal('ENUM'),
    t.Literal('DATE'),
    t.Literal('ARRAY')
  ]),
  description: t.Optional(t.String({ maxLength: 500 })),
  required: t.Optional(t.Boolean({ default: false })),
  defaultValue: t.Optional(t.String({ maxLength: 1000 })),
  options: t.Optional(t.Array(t.String({ maxLength: 100 }))),
  order: t.Optional(t.Number())
})

export const updateServiceCustomFieldSchema = t.Object({
  path: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  type: t.Optional(t.Union([
    t.Literal('STRING'),
    t.Literal('NUMBER'),
    t.Literal('BOOLEAN'),
    t.Literal('ENUM'),
    t.Literal('DATE'),
    t.Literal('ARRAY')
  ])),
  description: t.Optional(t.String({ maxLength: 500 })),
  required: t.Optional(t.Boolean()),
  defaultValue: t.Optional(t.String({ maxLength: 1000 })),
  options: t.Optional(t.Array(t.String({ maxLength: 100 }))),
  order: t.Optional(t.Number())
})

export const findAllServiceCustomFieldQuerySchema = createPaginationQuerySchema(t.Object({
  serviceIdValue: t.Optional(t.String({ format: 'uuid' })),
  nameValue: t.Optional(t.String({ minLength: 1 })),
  typeValue: t.Optional(t.String({ minLength: 1 })),
  requiredValue: t.Optional(t.Boolean()),
  startTime: t.Optional(t.String({ format: 'date-time' })),
  endTime: t.Optional(t.String({ format: 'date-time' }))
}))

export type CreateServiceCustomFieldDTO = typeof createServiceCustomFieldSchema.static
export type UpdateServiceCustomFieldDTO = typeof updateServiceCustomFieldSchema.static
export type FindAllServiceCustomFieldQueryDTO = typeof findAllServiceCustomFieldQuerySchema.static