import { integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { service } from "."

export const serviceRoute = pgTable('service_route', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    order: integer().notNull(),
    condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
    description: varchar({ length: 5000 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    // createdby: uuid().references(() => user.id).notNull(), // created
    // updatedby: uuid().references(() => user.id).notNull(), // updated
})

export type ServiceRoute = typeof serviceRoute.$inferSelect