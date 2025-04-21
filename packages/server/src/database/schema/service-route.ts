import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { serviceTable } from '.';

export const serviceRouteTable = pgTable('service_route', {
  id: uuid().defaultRandom().primaryKey(),
  serviceId: uuid()
    .references(() => serviceTable.id)
    .notNull(),
  order: integer().notNull(),
  condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
  description: varchar({ length: 5000 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  // createdBy: uuid().references(() => user.id).notNull(), // created
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
});

export type ServiceRoute = typeof serviceRouteTable.$inferSelect;
