import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { teamTable, userTable } from '.';

export const teamMemberTable = pgTable('team_member', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .references(() => userTable.id)
    .notNull(),
  teamId: uuid()
    .references(() => teamTable.id)
    .notNull(),
});
