import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 500 }).notNull(),
    email: varchar({ length: 500 }).notNull(),
    
})

export const team = pgTable('team', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 500 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})

export const teamMember = pgTable('team_member', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().references(() => user.id).notNull(),
    teamId: uuid().references(() => team.id).notNull(),
})

export const customeFieldType = pgEnum('custom_field_type', ['string', 'number', 'boolean', 'array', 'enum'])
export type CustomeFieldType = (typeof customeFieldType.enumValues)[number]

export const globalCustomField = pgTable('global_custome_field', {
    id: uuid().defaultRandom().primaryKey(),
    path: varchar({ length: 500 }).notNull(),
    type: customeFieldType().notNull(),
    required: boolean().default(false).notNull(),
    enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    updatedby: uuid().references(() => user.id).notNull(), // updated
})


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

export const alertRelation = relations(alert, ({ one }) => ({
    incident: one(incident, {
        fields: [alert.incidentId],
        references: [incident.id],
    }),
    service: one(service, {
        fields: [alert.serviceId],
        references: [service.id],  
    })
}))

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

export const comment = pgTable('comment', {
    id: uuid().defaultRandom().primaryKey(),
    content: varchar({ length: 500 }).notNull(),
    incidentId: uuid().references(() => incident.id).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    commenterId: uuid().references(() => user.id).notNull(),
})

export const incidentActionStatus = pgEnum('incident_action_status', ['none', 'triggered','sucess','failed'])

export const incidentAction = pgTable('incident_action', {
    id: uuid().defaultRandom().primaryKey(),
    incidentId: uuid().references(() => incident.id).notNull(),
    status: incidentActionStatus().default('none'),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    targertUrl: varchar({ length: 500 }).notNull(),
    headers: jsonb().default({}).notNull().$type<Record<string, string>>(),
    input: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
    output: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
})

export const service = pgTable('service', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 500 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})


export const serviceTeam = pgTable('service_team', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    teamId: uuid().references(() => team.id).notNull(),
})

export const serviceUser = pgTable('service_user', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    userId: uuid().references(() => user.id).notNull(),
})

export const serviceRoute = pgTable('service_route', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    order: integer().notNull(),
    condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(),
    description: varchar({ length: 5000 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    createdby: uuid().references(() => user.id).notNull(), // created
    updatedby: uuid().references(() => user.id).notNull(), // updated
})

export type ServiceRoute = typeof serviceRoute.$inferSelect

export const incidentType = pgTable('incident_type', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 500 }).notNull(),
    serviceId: uuid().references(() => service.id).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
    order: integer().notNull(), // exp
    title: varchar({ length: 500 }).notNull(), // exp
    description: varchar({ length: 5000 }).notNull(), // exp
    updatedAt: timestamp().defaultNow().notNull(),
    updatedby: uuid().references(() => user.id).notNull(), // updated
    createdby: uuid().references(() => user.id).notNull(), // created
})

export type IncidentType = typeof incidentType.$inferSelect

export const incidentTypeStatusCondition = pgTable('incident_type_status_condition', {
    id: uuid().defaultRandom().primaryKey(),
    incidentTypeId: uuid().references(() => incidentType.id).notNull(),
    condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
    status: incidentStatus().notNull(), 
    order: integer().notNull(), // exp
})

export const serviceCustomField = pgTable('service_custome_field', {
    id: uuid().defaultRandom().primaryKey(),
    serviceId: uuid().references(() => service.id).notNull(),
    path: varchar({ length: 500 }).notNull(),
    type: customeFieldType().notNull(),
    required: boolean().default(false).notNull(),
    enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    updatedby: uuid().references(() => user.id).notNull(), // updated
})

export const IncidentTypeRelation = relations(incidentType, ({ many, one }) => ({
    statusConditions: many(incidentTypeStatusCondition),
    service: one(service, {
        fields: [incidentType.serviceId],
        references: [service.id], 
    })
}))

export const serviceRelation = relations(service, ({ many }) => ({
    customeFields: many(serviceCustomField),
    incidentTypes: many(incidentType), 
}))

export const serviceCustomFieldRelation = relations(serviceCustomField, ({ one }) => ({
    service: one(service, {
        fields: [serviceCustomField.serviceId],
        references: [service.id],
    })
}))

