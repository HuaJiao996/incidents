import { createAuthClient as createBetterAuthClient } from 'better-auth/vue';
import type { auth } from './auth.ts';
import {
  apiKeyClient,
  inferAdditionalFields,
  adminClient,
} from 'better-auth/client/plugins';

export const createAuthClient = (baseURL: string) =>
  createBetterAuthClient({
    baseURL,
    plugins: [adminClient(), apiKeyClient(), inferAdditionalFields<typeof auth>()],
  });
