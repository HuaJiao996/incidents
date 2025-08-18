import { createAuthClient } from '@incidents/auth/client';

export const authClient =  createAuthClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');