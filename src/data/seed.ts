// src/db/seed.ts
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { apartments, buildings, users } from '@/schema';

dotenv.config({ path: './.env.development' });

if (!('POSTGRES_URL' in process.env))
  throw new Error('POSTGRES_URL not found on .env.development');

const main = async () => {
  const client = new Pool({ connectionString: process.env.POSTGRES_URL });
  const db = drizzle(client);

  console.log('Seed start');
  console.log('+ buildings');
  const buildingsData: (typeof buildings.$inferInsert)[] = [];
  [1, 2, 6, 7].forEach(n => buildingsData.push({
    number: n,
    name: `Строение ${n}`,
    address: `Ларина 45/${n}`
  }));
  await db.insert(buildings).values(buildingsData);

  console.log('+ apartments');
  const apartmentsData: (typeof apartments.$inferInsert)[] = [];
  Array
    .from({ length: 100 }, (_, i) => i + 1)
    .forEach(n => buildingsData.push({ number: n }));

  await db.insert(apartments).values(apartmentsData);

  console.log('Seed done');
};

main();
