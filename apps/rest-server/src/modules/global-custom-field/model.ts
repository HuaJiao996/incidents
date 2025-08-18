import { t } from 'elysia'
import { createPaginationQuerySchema } from '@incidents/common'
import {
  GlobalCustomFieldInputUpdate,
  GlobalCustomFieldPlain,
  GlobalCustomFieldPlainInputCreate,
} from '@incidents/database/schema/GlobalCustomField'

export const createGlobalCustomFieldSchema = GlobalCustomFieldPlainInputCreate

export const updateGlobalCustomFieldSchema = GlobalCustomFieldInputUpdate

export const findAllGlobalCustomFieldQuerySchema = createPaginationQuerySchema(
  t.Composite([
    t.Partial(GlobalCustomFieldPlain),
    t.Object({
      startTime: t.Optional(t.Date()),
      endTime: t.Optional(t.Date()),
    }),
  ]),
)

export type CreateGlobalCustomFieldDTO = typeof createGlobalCustomFieldSchema.static
export type UpdateGlobalCustomFieldDTO = typeof updateGlobalCustomFieldSchema.static
export type FindAllGlobalCustomFieldQueryDTO = typeof findAllGlobalCustomFieldQuerySchema.static
