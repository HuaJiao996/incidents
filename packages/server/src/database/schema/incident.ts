import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { incidentType, user } from '.';
import { relations } from 'drizzle-orm';

export const incidentStatus = pgEnum('incident_status', [
  'triggered',
  'acknowledged',
  'resolved',
]);

export const incident = pgTable('incident', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 5000 }).notNull(),
  incidentTypeId: uuid()
    .references(() => incidentType.id)
    .notNull(),
  incidentTypeGroupId: uuid().references(() => incidentType.id), // exp
  status: incidentStatus().default('triggered'),
  detail: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  assigneeId: uuid()
    .references(() => user.id)
    .notNull(),
  resolvedAt: timestamp().defaultNow().notNull(),
  resolvedById: uuid()
    .references(() => user.id)
    .notNull(),
  resolvedReason: varchar({ length: 500 }).notNull(),
});

export const childIncident = pgTable('child_incident', {
  id: uuid()
    .references(() => incident.id)
    .primaryKey(),
  parentId: uuid()
    .references(() => incident.id)
    .notNull(),
});

export const incidentRelations = relations(incident, ({ many, one }) => ({
  childIncidents: many(childIncident),
  parentIncident: one(childIncident, {
    fields: [incident.id],
    references: [childIncident.parentId],
  }),
}));
