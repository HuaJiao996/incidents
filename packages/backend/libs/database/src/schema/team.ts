import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const teamTable = pgTable('team', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
