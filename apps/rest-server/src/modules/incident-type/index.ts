import { t } from 'elysia'
import { withAuthElysia } from '../../utils'
import {
  createIncidentTypeSchema,
  updateIncidentTypeSchema,
  findAllIncidentTypeQuerySchema,
} from './model'
import {
  createIncidentType,
  findAllIncidentType,
  findIncidentTypeById,
  updateIncidentType,
  deleteIncidentType,
} from './service'

export const incidentTypeModule = withAuthElysia({ prefix: '/incident-types' })
  .get(
    '/',
    async ({ query }) => {
      return await findAllIncidentType(query)
    },
    {
      query: findAllIncidentTypeQuerySchema,
      auth: {
        incident: ['read'],
      },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      return await createIncidentType(body)
    },
    {
      body: createIncidentTypeSchema,
      auth: {
        incident: ['read', 'create'],
      },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await findIncidentTypeById(params.id)
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      auth: {
        incident: ['read'],
      },
    },
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      return await updateIncidentType(params.id, body)
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      body: updateIncidentTypeSchema,
      auth: {
        incident: ['read', 'update'],
      },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      await deleteIncidentType(params.id)
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      auth: {
        incident: ['read', 'delete'],
      },
    },
  )
