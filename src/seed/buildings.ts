import { buildings } from '@/schema';

import { db } from '../drizzle';

const DATA = [1, 2, 6, 7];

export async function seed() {
  console.log('+ buildings');
  const data: (typeof buildings.$inferInsert)[] = [];

  DATA.forEach(n => data.push({
    number: n,
    name: `Строение ${n}`,
    address: `Ларина 45/${n}`
  }));

  const result = await db.insert(buildings).values(data).onConflictDoNothing().returning();
  const map = new Map(result.map(r => [r.number, r.id]));

  return { map };
}
