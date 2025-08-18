import { withAuthElysia } from '@/utils'
import { createAlertSchema, findAllAlertQuerySchema } from './model'
import { createAlert, createAlertForService, findAllAlert } from './service'


export const alertModule = withAuthElysia({ prefix: '/alert' })
  .guard({
    body: createAlertSchema,
    apiKey: true
  })
  .post('/', ctx => createAlert(ctx.auth.apiKey!, ctx.body))
  .post('/:serviceId', ctx => createAlertForService(ctx.auth.apiKey!, ctx.params.serviceId, ctx.body))
  .guard({
    query: findAllAlertQuerySchema,
    auth: {
      alert: ['read']
    }
  })
  .get('/', ctx => findAllAlert(ctx.query))


