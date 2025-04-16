import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export const dbClient =  drizzle(process.env.DATABASE_URL!, { schema, logger: true });

