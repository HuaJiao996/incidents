import { withAuthElysia } from '../../utils'
import { createServiceRouteSchema, updateServiceRouteSchema, findAllServiceRouteQuerySchema } from './model'
import { createServiceRoute, findAllServiceRoute, findServiceRouteById, updateServiceRoute, deleteServiceRoute } from './service'

export const serviceRouteModule = withAuthElysia({ prefix: '/service-route' })
  .get('/', ({ query }) => findAllServiceRoute(query), {
    query: findAllServiceRouteQuerySchema,
    auth: {
      global: ['read']
    }
  })
  .get('/:id', ({ params: { id } }) => findServiceRouteById(id), {
    auth: {
      global: ['read']
    }
  })
  .post('/', ({ body, auth: { user } }) => createServiceRoute(user.id, body), {
    body: createServiceRouteSchema,
    auth: {
      global: ['read', 'create']
    }
  })
  .patch('/:id', ({ params: { id }, body, auth: { user } }) => updateServiceRoute(user.id, id, body), {
    body: updateServiceRouteSchema,
    auth: {
      global: ['read', 'update']
    }
  })
  .delete('/:id', ({ params: { id }, auth: { user } }) => deleteServiceRoute(user.id, id), {
    auth: {
      global: ['read', 'delete']
    }
  })