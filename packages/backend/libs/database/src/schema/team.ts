import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { withAtTimestemp } from './utils';
import { teamMemberTable } from './team-member';
import { relations } from 'drizzle-orm';

export const teamTable = pgTable('team', withAtTimestemp({
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 500 }).notNull(),
}));

export const teamTableRelations = relations(teamTable, ({ many }) => ({
  teamMembers: many(teamMemberTable),
}))
