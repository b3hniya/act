import { pgSchema, varchar, uuid, timestamp, numeric } from 'drizzle-orm/pg-core';
import { customers } from '../customer/customer.schema.js';

/**
 * Invoice domain schema
 */
export const invoiceSchema = pgSchema('invoice');

/**
 * Invoice table schema
 * Mirrors the Invoice type from @act/types
 */
export const invoices = invoiceSchema.table('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
