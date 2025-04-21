import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { team, user } from '.';

export const teamMember = pgTable('team_member', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .references(() => user.id)
    .notNull(),
  teamId: uuid()
    .references(() => team.id)
    .notNull(),
});
