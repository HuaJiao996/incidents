import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { customFieldType, service } from '.';

export const serviceCustomField = pgTable('service_custom_field', {
  id: uuid().defaultRandom().primaryKey(),
  serviceId: uuid()
    .references(() => service.id)
    .notNull(),
  path: varchar({ length: 500 }).notNull(),
  type: customFieldType().notNull(),
  required: boolean().default(false).notNull(),
  enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
});

export const serviceCustomFieldRelations = relations(
  serviceCustomField,
  ({ one }) => ({
    service: one(service, {
      fields: [serviceCustomField.serviceId],
      references: [service.id],
    }),
  }),
);
