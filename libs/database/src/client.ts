import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';

/**
 * Create a Drizzle client connected to PostgreSQL
 * @see https://orm.drizzle.team/docs/get-started/postgresql-new
 */
export function createDrizzleClient(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Using the new Drizzle API with client option
  return drizzle({ client: pool, schema });
}

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;
