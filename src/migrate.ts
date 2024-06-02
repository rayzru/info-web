import { sql } from '@vercel/postgres';
import { drizzle as LocalDrizzle } from 'drizzle-orm/postgres-js';
import { migrate as LocalMigrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle as VercelDrizzle } from 'drizzle-orm/vercel-postgres';
import { migrate as VercelMigrate } from 'drizzle-orm/vercel-postgres/migrator';
import postgres from 'postgres';

import 'dotenv/config';

const migrationsFolder = './src/migrations';

export async function runMigrate() {
  console.log('⏳ Running migrations...');
  const start = Date.now();

  if (process.env.NODE_ENV === 'production') {
    const vercelDB = VercelDrizzle(sql);
    await VercelMigrate(vercelDB, { migrationsFolder });
  } else {
    const migrationClient = postgres(process.env.POSTGRES_URL as string, { max: 1 });
    const localDb = LocalDrizzle(migrationClient);
    await LocalMigrate(localDb, { migrationsFolder });
    await migrationClient.end();
  }

  const end = Date.now();
  console.log(`✅ Migrations completed in ${end - start}ms`);
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
