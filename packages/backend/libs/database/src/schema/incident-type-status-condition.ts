import { pgTable, uuid, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { incidentStatus, incidentTypeTable, incidentTypeGroupTable } from '.';
import { relations } from 'drizzle-orm';
import { TopLevelCondition } from 'json-rules-engine';
import { withAtTimestemp } from './utils';

export const incidentTypeStatusConditionTable = pgTable(
  'incident_type_status_condition',
  withAtTimestemp({
    id: uuid().defaultRandom().primaryKey(),
    incidentTypeId: uuid()
      .references(() => incidentTypeTable.id)
      .notNull(),
    condition: jsonb().default({}).notNull().$type<TopLevelCondition>(), // exp
    status: incidentStatus().notNull(),
    order: integer().notNull(), // exp
    groupId: uuid().references(() => incidentTypeGroupTable.id), // exp
  }),
  (t) => [
    index('incident_type_status_condition_incident_type_id_group_id_idx').on(
      t.incidentTypeId,
      t.groupId,
    ),
  ],
);

export const incidentTypeStatusConditionTableRelations = relations(
  incidentTypeStatusConditionTable,
  ({ one }) => ({
    incidentType: one(incidentTypeTable, {
      fields: [incidentTypeStatusConditionTable.incidentTypeId],
      references: [incidentTypeTable.id],
    }),
  }),
);
