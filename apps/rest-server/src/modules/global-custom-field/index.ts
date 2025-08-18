import { t } from 'elysia'
import { withAuthElysia } from '../../utils'
import {
  createGlobalCustomFieldSchema,
  updateGlobalCustomFieldSchema,
  findAllGlobalCustomFieldQuerySchema,
} from './model'
import {
  createGlobalCustomField,
  findAllGlobalCustomField,
  findGlobalCustomFieldById,
  updateGlobalCustomField,
  deleteGlobalCustomField,
} from './service'

export const globalCustomFieldModule = withAuthElysia({ prefix: '/global-custom-fields' })
  .guard({
    auth: {
      global: ['read'],
    },
  })
  .get(
    '/',
    async ({ query }) => {
      return await findAllGlobalCustomField(query)
    },
    {
      query: findAllGlobalCustomFieldQuerySchema,
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await findGlobalCustomFieldById(params.id)
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  )
  .post(
    '/',
    async ({ body, auth }) => {
      return await createGlobalCustomField(auth.user!.id, body)
    },
    {
      body: createGlobalCustomFieldSchema,
      auth: {
        global: ['read', 'create'],
      },
    },
  )
  .patch(
    '/:id',
    async ({ params, body, auth }) => {
      return await updateGlobalCustomField(auth.user!.id, params.id, body)
    },
    {
      body: updateGlobalCustomFieldSchema,
      params: t.Object({
        id: t.Number(),
      }),
      auth: {
        global: ['read', 'update'],
      },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      await deleteGlobalCustomField(params.id)
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      auth: {
        global: ['read', 'delete'],
      },
    },
  )
