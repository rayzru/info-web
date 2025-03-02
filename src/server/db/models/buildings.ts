import { type Database } from "../index";
import * as schema from "../schema";

export const buildings = ({ db }: { db: Database }) => ({
  create: async (building: typeof schema.buildings.$inferInsert) => {
    const [b] = await db.insert(schema.buildings).values(building).returning();
    return b;
  },
  findMany: async () => {
    return await db.query.buildings.findMany();
  },
});
