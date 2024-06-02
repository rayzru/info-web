import { sql } from '@vercel/postgres';
import {
  drizzle as LocalDrizzle,
  type PostgresJsDatabase,
} from 'drizzle-orm/postgres-js';
import {
  drizzle as VercelDrizzle,
  type VercelPgDatabase,
} from 'drizzle-orm/vercel-postgres';
import postgres from 'postgres';

let db:
  | VercelPgDatabase<Record<string, never>>
  | PostgresJsDatabase<Record<string, never>>;

if (process.env.NODE_ENV === 'production') {
  db = VercelDrizzle(sql);
} else {
  const client = postgres(process.env.POSTGRES_URL as string);
  db = LocalDrizzle(client);
}

export { db };
