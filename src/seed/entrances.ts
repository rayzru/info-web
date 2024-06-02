import { entrances } from '@/schema';

import { db } from '../drizzle';

const BUILDINGS_NUMBERS = [1, 2, 6, 7];
const ENTRANCES_NUMBERS = [1, 2];

export async function seed(buildingDataMap: Map<number, number>) {
  console.log('+ entrances');
  const data: (typeof entrances.$inferInsert)[] = [];

  BUILDINGS_NUMBERS.forEach(buildingsNumber => {
    ENTRANCES_NUMBERS.forEach(entranceNumber => {
      data.push({
        buildingId: buildingDataMap.get(buildingsNumber),
        number: entranceNumber,
        name: `Подъезд ${entranceNumber}`
      });
    });
  });

  const result = await db.insert(entrances).values(data).onConflictDoNothing().returning();
  const map = new Map(result.map(r => [r.number, r.id]));

  return { map };
}
