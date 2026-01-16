/**
 * @act/database - Drizzle ORM database layer
 *
 * Exports:
 * - DatabaseModule: NestJS module for dependency injection
 * - DRIZZLE: Injection token for the database client
 * - DrizzleDB: Type for the database client
 * - Schema tables: customers, invoices, etc.
 * - drizzle-orm utilities: eq, and, or, etc.
 */

// NestJS module
export { DatabaseModule } from './database.module.js';

// Injection token
export { DRIZZLE } from './constants.js';

// Types
export type { DrizzleDB } from './types.js';
export type { DrizzleClient } from './client.js';

// Client factory (for advanced usage)
export { createDrizzleClient } from './client.js';

// All schemas
export * from './schema/index.js';

// Re-export common drizzle-orm utilities for convenience
export { eq, ne, gt, gte, lt, lte, and, or, like, ilike, sql } from 'drizzle-orm';
