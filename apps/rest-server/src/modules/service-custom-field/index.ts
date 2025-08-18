import { withAuthElysia } from '../../utils'
import {
  createServiceCustomFieldSchema,
  updateServiceCustomFieldSchema,
  findAllServiceCustomFieldQuerySchema,
} from './model'
import {
  createServiceCustomField,
  findAllServiceCustomField,
  findServiceCustomFieldById,
  updateServiceCustomField,
  deleteServiceCustomField,
} from './service'

export const serviceCustomFieldModule = withAuthElysia({ prefix: '/service-custom-fields' })
  .get(
    '/',
    async ({ query }) => {
      return await findAllServiceCustomField(query)
    },
    {
      query: findAllServiceCustomFieldQuerySchema,
      auth: { service: ['read'] },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      return await createServiceCustomField(body)
    },
    {
      body: createServiceCustomFieldSchema,
      auth: { service: ['read', 'create'] },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await findServiceCustomFieldById(params.id)
    },
    {
      auth: { service: ['read'] },
    },
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      return await updateServiceCustomField(params.id, body)
    },
    {
      body: updateServiceCustomFieldSchema,
      auth: { service: ['read', 'update'] },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      await deleteServiceCustomField(params.id)
    },
    {
      auth: { service: ['read', 'delete'] },
    },
  )
