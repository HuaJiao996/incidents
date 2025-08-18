import { t, type TSchema } from 'elysia'
const paginationSchema = t.Object({
  page: t.Number({ minimum: 1, default: 1 }),
  pageSize: t.Number({ minimum: 1, maximum: 100, default: 10 }),
})

const paginationQuerySchema = t.Composite([
  paginationSchema,
  t.Object({
    sortFields: t.Optional(t.String({ pattern: '^[a-zA-Z_][a-zA-Z0-9_]*(,[a-zA-Z_][a-zA-Z0-9_]*)*$' })),
    sortOrders: t.Optional(t.String({ pattern: '^(asc|desc)(,(asc|desc))*$' })),
  }),
])

const paginationResponseSchema = t.Composite([
  paginationSchema,
  t.Object({
    total: t.Number({ minimum: 0 }),
  }),
])

export const createPaginationQuerySchema = <T extends TSchema>(schema: T) =>
  t.Composite([paginationQuerySchema, schema])

export const createPaginationResponseSchema = <T extends TSchema>(schema: T) =>
  t.Composite([
    paginationResponseSchema,
    t.Object({
      total: t.Number(),
      data: t.Array(schema),
    }),
  ])
