import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { withAtTimestemp } from './utils';

export const userTable = pgTable('user', withAtTimestemp({
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  email: varchar({ length: 500 }).notNull(),
}));
