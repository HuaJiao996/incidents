import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const customeFieldType = pgEnum('custom_field_type', [
  'string',
  'number',
  'boolean',
  'array',
  'enum',
]);

export type CustomeFieldType = (typeof customeFieldType.enumValues)[number];

export const globalCustomField = pgTable('global_custome_field', {
  id: uuid().defaultRandom().primaryKey(),
  path: varchar({ length: 500 }).notNull(),
  type: customeFieldType().notNull(),
  required: boolean().default(false).notNull(),
  enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedby: uuid().references(() => user.id).notNull(), // updated
});
