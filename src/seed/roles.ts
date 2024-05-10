import { roles } from '@/schema';

import { db } from '../drizzle';
import * as rolesData from './json/roles.json';

export async function seed() {

  console.log('+ roles');
  const data: (typeof roles.$inferInsert)[] = [];
  rolesData.forEach((j) => data.push(j));

  const result = await db.insert(roles).values(data).onConflictDoNothing().returning();
  const map = new Map(result.map(r => [r.name, r.id]));

  return { map };
}
