import { t } from 'elysia'
import { createPaginationQuerySchema } from '@incidents/common'

export const createIncidentTypeSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.Optional(t.String({ maxLength: 500 })),
  priority: t.Union([
    t.Literal('LOW'),
    t.Literal('MEDIUM'),
    t.Literal('HIGH'),
    t.Literal('CRITICAL')
  ]),
  color: t.Optional(t.String({ pattern: '^#[0-9A-Fa-f]{6}$' })),
  icon: t.Optional(t.String({ maxLength: 50 })),
  isActive: t.Optional(t.Boolean({ default: true })),
  autoAssign: t.Optional(t.Boolean({ default: false }))
})

export const updateIncidentTypeSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  description: t.Optional(t.String({ maxLength: 500 })),
  priority: t.Optional(t.Union([
    t.Literal('LOW'),
    t.Literal('MEDIUM'),
    t.Literal('HIGH'),
    t.Literal('CRITICAL')
  ])),
  color: t.Optional(t.String({ pattern: '^#[0-9A-Fa-f]{6}$' })),
  icon: t.Optional(t.String({ maxLength: 50 })),
  isActive: t.Optional(t.Boolean()),
  autoAssign: t.Optional(t.Boolean())
})

export const findAllIncidentTypeQuerySchema = createPaginationQuerySchema(t.Object({
  nameValue: t.Optional(t.String({ minLength: 1 })),
  priorityValue: t.Optional(t.String({ minLength: 1 })),
  isActiveValue: t.Optional(t.Boolean()),
  autoAssignValue: t.Optional(t.Boolean()),
  startTime: t.Optional(t.String({ format: 'date-time' })),
  endTime: t.Optional(t.String({ format: 'date-time' }))
}))

export type CreateIncidentTypeDTO = typeof createIncidentTypeSchema.static
export type UpdateIncidentTypeDTO = typeof updateIncidentTypeSchema.static
export type FindAllIncidentTypeQueryDTO = typeof findAllIncidentTypeQuerySchema.static