import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const notes = sqliteTable('note', {
  id: text('id').primaryKey().notNull().default(sql`(lower(hex(randomblob(16))))`), // UUID-ish
  engineer: text('engineer'),
  created: text('created').notNull().default(sql`CURRENT_TIMESTAMP`),
  text: text('text').notNull(),
  status: text('status').notNull(),
  madeCritical: text('made_critical'),
  madeRecurring: text('made_recurring'),
  madeSolved: text('made_solved'),
});

