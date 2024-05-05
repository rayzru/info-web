import { sql } from '@vercel/postgres';
import { drizzle as LocalDrizzle } from 'drizzle-orm/postgres-js';
import { migrate as LocalMigrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle as VercelDrizzle } from 'drizzle-orm/vercel-postgres';
import { migrate as VercelMigrate } from 'drizzle-orm/vercel-postgres/migrator';
import postgres from 'postgres';

import 'dotenv/config';

let db;
if (process.env.NODE_ENV === 'production') {
  db = VercelDrizzle(sql);
  await VercelMigrate(db, { migrationsFolder: './src/migrations' });
} else {
  const migrationClient = postgres(process.env.POSTGRES_URL as string, { max: 1 });
  db = LocalDrizzle(migrationClient);
  await LocalMigrate(db, { migrationsFolder: './src/migrations' });
  await migrationClient.end();
}
