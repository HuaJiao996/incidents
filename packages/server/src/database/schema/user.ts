import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 500 }).notNull(),
    email: varchar({ length: 500 }).notNull(),
    
})