import { pgSchema, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';

/**
 * Customer domain schema
 */
export const customerSchema = pgSchema('customer');

/**
 * Customer table schema
 * Mirrors the Customer type from @act/types
 */
export const customers = customerSchema.table('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zip: varchar('zip', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
