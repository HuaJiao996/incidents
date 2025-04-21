import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  email: varchar({ length: 500 }).notNull(),
});
