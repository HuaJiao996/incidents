import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { incidentTypeTable, serviceCustomFieldTable } from '.';

export const serviceTable = pgTable('service', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const serviceTableRelations = relations(serviceTable, ({ many }) => ({
  customFields: many(serviceCustomFieldTable),
  incidentTypes: many(incidentTypeTable),
}));

export type Service = typeof serviceTable.$inferSelect;
export type NewService = typeof serviceTable.$inferInsert;
