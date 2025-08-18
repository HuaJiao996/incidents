import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { serviceModule } from './modules/service';
import { serviceRouteModule } from './modules/service-route';
import { serviceCustomFieldModule } from './modules/service-custom-field';
import { incidentTypeModule } from './modules/incident-type';
import { globalCustomFieldModule } from './modules/global-custom-field';
import {
  elysiaAuth,
} from '@incidents/auth';
import { cors } from '@elysiajs/cors'
import { incidentModule } from './modules/incident';
import { globalLogger } from '@incidents/common';
import { alertModule } from './modules/alert';
import { format } from 'date-fns';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(globalLogger)
  .use(elysiaAuth)
  .get('/health', () => {
    return {
      status: 'healthy',
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      service: 'rest-server'
    }
  })
  .group('/api', app => app
    .use(serviceModule)
    .use(serviceRouteModule)
    .use(serviceCustomFieldModule)
    .use(incidentModule)
    .use(incidentTypeModule)
    .use(alertModule)
    .use(globalCustomFieldModule)
    // .use(userModule)
    // .use(apikeyModule)
  )
  .onError(({ error, code }) => {
    console.error(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Error ${code}:`, error)
    
    if (code === 'VALIDATION') {
      return {
        error: 'Validation Error',
        message: error.message,
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }
    }
    
    return {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }
  })

const port = process.env.REST_SERVER_PORT || 3000
app.listen(port)

const startTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
console.log(`🚀 REST Server started at ${startTime}`)
console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
console.log(`📚 Swagger UI: http://${app.server?.hostname}:${app.server?.port}/swagger`)
console.log(`💚 Health check: http://${app.server?.hostname}:${app.server?.port}/health`)

// 优雅关闭处理
process.on('SIGINT', () => {
  console.log(`\n🛑 REST Server shutting down at ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
  process.exit(0)
})