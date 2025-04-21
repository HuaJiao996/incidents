import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { incidentTypeTable, userTable } from '.';
import { relations } from 'drizzle-orm';

export const incidentStatus = pgEnum('incident_status', [
  'triggered',
  'acknowledged',
  'resolved',
]);

export const incidentTable = pgTable('incident', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 5000 }).notNull(),
  incidentTypeId: uuid()
    .references(() => incidentTypeTable.id)
    .notNull(),
  incidentTypeGroupId: uuid().references(() => incidentTypeTable.id), // exp
  status: incidentStatus().default('triggered'),
  detail: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  assigneeId: uuid()
    .references(() => userTable.id)
    .notNull(),
  resolvedAt: timestamp().defaultNow().notNull(),
  resolvedById: uuid()
    .references(() => userTable.id)
    .notNull(),
  resolvedReason: varchar({ length: 500 }).notNull(),
});

export const childIncidentTable = pgTable('child_incident', {
  id: uuid()
    .references(() => incidentTable.id)
    .primaryKey(),
  parentId: uuid()
    .references(() => incidentTable.id)
    .notNull(),
});

export const incidentTableRelations = relations(incidentTable, ({ many, one }) => ({
  childIncidents: many(childIncidentTable),
  parentIncident: one(childIncidentTable, {
    fields: [incidentTable.id],
    references: [childIncidentTable.parentId],
  }),
}));
