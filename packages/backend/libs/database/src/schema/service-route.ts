import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { serviceTable } from '.';
import { TopLevelCondition } from 'json-rules-engine';
import { withAtTimestemp } from './utils';

export const serviceRouteTable = pgTable('service_route', withAtTimestemp({
  id: uuid().defaultRandom().primaryKey(),
  serviceId: uuid()
    .references(() => serviceTable.id)
    .notNull(),
  order: integer().notNull(),
  condition: jsonb().default({}).notNull().$type<TopLevelCondition>(),
  description: varchar({ length: 5000 }).notNull(),
}));

export type ServiceRoute = typeof serviceRouteTable.$inferSelect;
