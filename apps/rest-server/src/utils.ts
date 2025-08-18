import { elysiaAuth } from '@incidents/auth';
import { Elysia } from 'elysia';
type Config = {
    prefix: string
}
export const withAuthElysia = (config: Partial<Config>) => new Elysia(config)
      .use(elysiaAuth)