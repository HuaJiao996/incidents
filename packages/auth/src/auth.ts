import { prismaAdapter } from 'better-auth/adapters/prisma'
import { databaseClient } from '@incidents/database'
import { betterAuth, type Session, type User } from 'better-auth'
import { Elysia } from 'elysia'
import { apiKey, admin as adminPlugin } from 'better-auth/plugins'
import { ac, admin, manager, member, viewer, type Permissions } from './access-control'

export const auth = betterAuth({
  database: prismaAdapter(databaseClient, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        manager,
        member,
        viewer,
      },
    }),
    apiKey(),
  ],
})

export type Auth = {
  user?: User
  session?: Session
  apiKey?: string
}

export const elysiaAuth = new Elysia({ name: '@incidents/auth' }).mount(auth.handler).macro({
  auth: (permissions: Permissions) => {
    return {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        })

        if (!session) return status(401)

        const { success, error } = await auth.api.userHasPermission({
          body: {
            userId: session.user.id,
            permissions,
          },
        })
        if (error || !success) {
          return status(401)
        }

        const authData: Auth = {
          user: session.user,
          session: session.session,
        }
        return { auth: authData }
      },
    }
  },
  apiKey: () => {
    return {
      async resolve({ status, request: { headers } }) {
        const apiKey = headers.get('x-api-key')
        if (!apiKey) return status(401)
        const data = await auth.api.verifyApiKey({
          body: {
            key: 'apiKey',
          },
        })
        if (!data.valid) return status(401)

        const authData: Auth = {
          apiKey,
        }
        return {
          auth: authData,
        }
      },
    }
  },
  both: () => {
    return {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        })
        const authData: Auth = {}
        if (session) {
          authData.user = session.user
          authData.session = session.session
          return {
            auth: authData,
          }
        }

        const apiKey = headers.get('x-api-key')
        if (!apiKey) return status(401)
        const data = await auth.api.verifyApiKey({
          body: {
            key: 'apiKey',
          },
        })
        if (!data.valid) return status(401)
        authData.apiKey = apiKey
        return {
          auth: authData,
        }
      },
    }
  },
})
