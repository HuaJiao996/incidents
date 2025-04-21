import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { incidentTypeStatusCondition, service } from '.';

export const incidentType = pgTable('incident_type', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  serviceId: uuid()
    .references(() => service.id)
    .notNull(),
  condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
  order: integer().notNull(), // exp
  title: varchar({ length: 500 }).notNull(), // exp
  description: varchar({ length: 5000 }).notNull(), // exp
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
  // createdBy: uuid().references(() => user.id).notNull(), // created
});

export const incidentTypeGroup = pgTable('incident_type_group', {
  id: uuid().defaultRandom().primaryKey(),
  incidentTypeId: uuid()
    .references(() => incidentType.id)
    .notNull(),
  groupName: varchar({ length: 500 }).notNull(), // exp
  condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
  order: integer().notNull(), // exp
});

export const IncidentTypeRelations = relations(
  incidentType,
  ({ many, one }) => ({
    statusConditions: many(incidentTypeStatusCondition),
    service: one(service, {
      fields: [incidentType.serviceId],
      references: [service.id],
    }),
  }),
);

export type IncidentType = typeof incidentType.$inferSelect;
