import type { DrizzleClient } from './client.js';

/**
 * Type alias for the Drizzle database instance
 * Use this type when injecting the database in repositories
 */
export type DrizzleDB = DrizzleClient;
