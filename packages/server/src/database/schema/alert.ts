import { relations } from "drizzle-orm"
import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { incident, service } from "."

export const alertType = pgEnum('alert_type', ['trigger','resolve'])
export type AlertType = (typeof alertType.enumValues)[number]

export const alert = pgTable('alert', {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar({ length: 500 }).notNull(),
    content: varchar({ length: 5000 }).notNull(),
    customFields: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
    type: alertType(),
    serviceId: uuid().references(() => service.id),
    incidentId: uuid().references(() => incident.id),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
})

export const alertRelations = relations(alert, ({ one }) => ({
    incident: one(incident, {
        fields: [alert.incidentId],
        references: [incident.id],
    }),
    service: one(service, {
        fields: [alert.serviceId],
        references: [service.id],  
    })
}))