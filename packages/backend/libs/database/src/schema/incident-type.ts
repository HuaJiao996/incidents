import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { incidentTypeStatusConditionTable, serviceTable } from '.';
import { TopLevelCondition } from 'json-rules-engine';

export const incidentTypeTable = pgTable('incident_type', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
  serviceId: uuid()
    .references(() => serviceTable.id)
    .notNull(),
  condition: jsonb().default({}).notNull().$type<TopLevelCondition>(), // exp
  order: integer().notNull(), // exp
  title: varchar({ length: 500 }).notNull(), // exp
  description: varchar({ length: 5000 }).notNull(), // exp
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
  // createdBy: uuid().references(() => user.id).notNull(), // created
});

export const incidentTypeGroupTable = pgTable('incident_type_group', {
  id: uuid().defaultRandom().primaryKey(),
  incidentTypeId: uuid()
    .references(() => incidentTypeTable.id)
    .notNull(),
  groupName: varchar({ length: 500 }).notNull(), // exp
  condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
  order: integer().notNull(), // exp
});

export const IncidentTypeTableRelations = relations(
  incidentTypeTable,
  ({ many, one }) => ({
    statusConditions: many(incidentTypeStatusConditionTable),
    service: one(serviceTable, {
      fields: [incidentTypeTable.serviceId],
      references: [serviceTable.id],
    }),
  }),
);

export type IncidentType = typeof incidentTypeTable.$inferSelect;
