import { relations } from 'drizzle-orm';
import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { incidentTable, serviceTable } from '.';
import { withAtTimestemp } from './utils';

export const alertType = pgEnum('alert_type', ['trigger', 'resolve']);
export type AlertType = (typeof alertType.enumValues)[number];

export const alertTable = pgTable('alert', withAtTimestemp({
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 500 }).notNull(),
  content: varchar({ length: 5000 }).notNull(),
  customFields: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
  type: alertType(),
  serviceId: uuid().references(() => serviceTable.id),
  incidentId: uuid().references(() => incidentTable.id),
}));

export const alertTableRelations = relations(alertTable, ({ one }) => ({
  incident: one(incidentTable, {
    fields: [alertTable.incidentId],
    references: [incidentTable.id],
  }),
  service: one(serviceTable, {
    fields: [alertTable.serviceId],
    references: [serviceTable.id],
  }),
}));

export type Alert = typeof alertTable.$inferSelect;
