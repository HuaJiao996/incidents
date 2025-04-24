import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { customFieldType, serviceTable } from '.';

export const serviceCustomFieldTable = pgTable('service_custom_field', {
  id: uuid().defaultRandom().primaryKey(),
  serviceId: uuid()
    .references(() => serviceTable.id)
    .notNull(),
  path: varchar({ length: 500 }).notNull(),
  type: customFieldType().notNull(),
  required: boolean().default(false).notNull(),
  enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
});

export const serviceCustomFieldTableRelations = relations(
  serviceCustomFieldTable,
  ({ one }) => ({
    service: one(serviceTable, {
      fields: [serviceCustomFieldTable.serviceId],
      references: [serviceTable.id],
    }),
  }),
);
