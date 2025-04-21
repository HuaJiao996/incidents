import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const customFieldType = pgEnum('custom_field_type', [
  'string',
  'number',
  'boolean',
  'array',
  'enum',
]);

export type CustomFieldType = (typeof customFieldType.enumValues)[number];

export const globalCustomField = pgTable('global_custom_field', {
  id: uuid().defaultRandom().primaryKey(),
  path: varchar({ length: 500 }).notNull(),
  type: customFieldType().notNull(),
  required: boolean().default(false).notNull(),
  enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
  // createdAt: timestamp().defaultNow().notNull(),
  // updatedAt: timestamp().defaultNow().notNull(),
  // updatedBy: uuid().references(() => user.id).notNull(), // updated
});
