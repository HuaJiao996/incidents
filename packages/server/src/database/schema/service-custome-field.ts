import { relations } from "drizzle-orm"
import { boolean, jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { customeFieldType, service } from "."

export const serviceCustomField = pgTable('service_custome_field', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    path: varchar({ length: 500 }).notNull(),
    type: customeFieldType().notNull(),
    required: boolean().default(false).notNull(),
    enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
    // createdAt: timestamp().defaultNow().notNull(),
    // updatedAt: timestamp().defaultNow().notNull(),
    // updatedby: uuid().references(() => user.id).notNull(), // updated
})

export const serviceCustomFieldRelations = relations(serviceCustomField, ({ one }) => ({
    service: one(service, {
        fields: [serviceCustomField.serviceId],
        references: [service.id],
    })
}))