import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { alertTable, incidentTypeTable, userTable } from '.';
import { relations } from 'drizzle-orm';

export const incidentStatus = pgEnum('incident_status', [
  'triggered',
  'acknowledged',
  'resolved',
]);

export type IncidentStatus = (typeof incidentStatus.enumValues)[number];

export const incidentTable = pgTable('incident', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 5000 }).notNull(),
  incidentTypeId: uuid()
    .references(() => incidentTypeTable.id)
    .notNull(),
  incidentTypeGroupId: uuid().references(() => incidentTypeTable.id),
  status: incidentStatus().default('triggered'),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  assigneeId: uuid()
    .references(() => userTable.id),
  resolvedAt: timestamp().defaultNow(),
  resolvedById: uuid()
    .references(() => userTable.id),
  resolvedReason: varchar({ length: 500 }),
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
