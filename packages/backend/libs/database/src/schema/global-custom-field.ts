import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { withAtTimestemp } from './utils';

export const customFieldType = pgEnum('custom_field_type', [
  'string',
  'number',
  'boolean',
  'array',
  'enum',
]);

export type CustomFieldType = (typeof customFieldType.enumValues)[number];

export const globalCustomFieldTable = pgTable('global_custom_field', withAtTimestemp({
  id: uuid().defaultRandom().primaryKey(),
  path: varchar({ length: 500 }).notNull(),
  type: customFieldType().notNull(),
  required: boolean().default(false).notNull(),
  enumValues: jsonb().default([]).notNull().$type<unknown[]>(),
}));

export type GlobalCustomField = typeof globalCustomFieldTable.$inferSelect;