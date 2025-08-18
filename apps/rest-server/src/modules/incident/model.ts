import { createPaginationQuerySchema } from '@incidents/common'
import { t } from 'elysia'

export const findAllIncidentQuerySchema = createPaginationQuerySchema(t.Object({
  // 过滤参数
  titleValue: t.Optional(t.String()),
  serviceValue: t.Optional(t.String()), // 多选，逗号分隔
  incidentIdValue: t.Optional(t.String()),
  statusValue: t.Optional(t.String()), // 多选，逗号分隔
  assigneeValue: t.Optional(t.String()), // 多选，逗号分隔
  startTime: t.Optional(t.String()),
  endTime: t.Optional(t.String()),
  updatedAtStart: t.Optional(t.String()),
  updatedAtEnd: t.Optional(t.String()),
}))

export type FindAllIncidentQueryDto = typeof findAllIncidentQuerySchema.static

