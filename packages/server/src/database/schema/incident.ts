import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { incidentType, user } from "."

export const incidentStatus = pgEnum('incident_status', ['triggered', 'acknowledged', 'resolved'])

export const incident = pgTable('incident', {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar({ length: 500 }).notNull(),
    description: varchar({ length: 5000 }).notNull(),
    incidentTypeId: uuid().references(() => incidentType.id).notNull(),
    status: incidentStatus().default('triggered'),
    detail: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    assigneeId: uuid().references(() => user.id).notNull(),
    resolvedAt: timestamp().defaultNow().notNull(),
    resolvedById: uuid().references(() => user.id).notNull(),
    resilvedReason: varchar({ length: 500 }).notNull(),
})