import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * The PostgreSQL connection is optional.
 *
 * - With DATABASE_URL set (local Postgres, Neon, Supabase, Render…) data is
 *   stored in the database.
 * - Without it, importing this module no longer throws: `hasDatabase` is false
 *   and src/lib/store.ts falls back to a JSON file, so the site still runs
 *   and visitors can still add notes.
 */
export const databaseUrl = process.env.DATABASE_URL?.trim() || "";
export const hasDatabase = databaseUrl.length > 0;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __serendibDb?: NodePgDatabase;
};

/** Returns the shared Drizzle client. Only call when `hasDatabase` is true. */
export function getDb(): NodePgDatabase {
  if (!hasDatabase) throw new Error("DATABASE_URL is not set");
  if (!globalForDb.__serendibDb) {
    const pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
        // Hosted databases (Neon, Supabase, Render…) require TLS; a local server usually does not.
        ssl: /sslmode=require|neon\.tech|supabase\.co|render\.com/.test(databaseUrl) ? { rejectUnauthorized: false } : undefined,
        max: 5,
      });
    globalForDb.__arenaNextJsPostgresqlPool = pool;
    globalForDb.__serendibDb = drizzle(pool);
  }
  return globalForDb.__serendibDb;
}
