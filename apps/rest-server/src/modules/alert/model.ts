import { createPaginationQuerySchema } from '@incidents/common'
import { AlertPlain, AlertPlainInputCreate, AlertSelect } from '@incidents/database/schema/Alert'
import { t } from 'elysia'

export const createAlertSchema = AlertPlainInputCreate
export type CreateAlertDTO = typeof createAlertSchema.static

export const findAllAlertQuerySchema = createPaginationQuerySchema(
  t.Composite([
    t.Partial(AlertPlain),
    t.Object({
      startTime: t.Optional(t.Date()),
      endTime: t.Optional(t.Date()),
    }),
  ]),
)

export type FindAllAlertQueryDTO = typeof findAllAlertQuerySchema.static

export interface AlertCustomFieldValue {
  [key: string]: any
}

export interface ValidationError {
  field: string
  reason: string
}
