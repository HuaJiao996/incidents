import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { incidentType, serviceCustomField } from '.';

export const service = pgTable('service', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
export const serviceRelations = relations(service, ({ many }) => ({
  customeFields: many(serviceCustomField),
  incidentTypes: many(incidentType),
}));
