import { pgTable, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { incidentStatus, incidentType } from ".";
import { relations } from "drizzle-orm";


export const incidentTypeStatusCondition = pgTable('incident_type_status_condition', {
    id: uuid().defaultRandom().primaryKey(),
    incidentTypeId: uuid().references(() => incidentType.id).notNull(),
    condition: jsonb().default({}).notNull().$type<Record<string, unknown>>(), // exp
    status: incidentStatus().notNull(), 
    order: integer().notNull(), // exp
})

export const incidentTypeStatusConditionRelations = relations(incidentTypeStatusCondition, ({ one }) => ({
    incidentType: one(incidentType, {
        fields: [incidentTypeStatusCondition.incidentTypeId],
        references: [incidentType.id],
    })
}))
