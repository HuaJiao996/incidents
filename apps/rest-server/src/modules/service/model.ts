import { t } from 'elysia'
import { createPaginationQuerySchema } from '@incidents/common'

export const createServiceSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  description: t.Optional(t.String({ maxLength: 1000 }))
})

export const findAllServiceQuerySchema = createPaginationQuerySchema(t.Object({
  idValue: t.Optional(t.String({ format: 'uuid' })),
  nameValue: t.Optional(t.String({ minLength: 1 })),
  descriptionValue: t.Optional(t.String({ minLength: 1 })),
  startTime: t.Optional(t.String({ format: 'date-time' })),
  endTime: t.Optional(t.String({ format: 'date-time' }))
}))

export type CreateServiceDTO = typeof createServiceSchema.static
export type FindAllServiceQueryDTO = typeof findAllServiceQuerySchema.static
