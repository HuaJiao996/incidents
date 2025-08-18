import { createService, findAllService, findServiceById, updateService } from './service'
import { createServiceSchema, findAllServiceQuerySchema } from './model'
import { withAuthElysia } from '@/utils'

export const serviceModule = withAuthElysia({ prefix: '/service' })
  .get('/', ({ query }) => findAllService(query), {
    query: findAllServiceQuerySchema,
    auth: {
      service: ['read'],
    },
  })
  .get('/:id', ({ params: { id } }) => findServiceById(id), {
    auth: {
      service: ['read'],
    },
  })
  .post('/', ({ body, auth: { user } }) => createService(user.id, body), {
    body: createServiceSchema,
    auth: {
      service: ['read', 'create'],
    },
  })
  .patch('/:id', ({ params: { id }, body, auth: { user } }) => updateService(user.id, id, body), {
    body: createServiceSchema,
    auth: {
      service: ['read', 'update'],
    },
  })
