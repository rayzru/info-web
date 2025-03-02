import { type Database } from "../index";
import * as schema from "../schema";

export const users = ({ db }: { db: Database }) => ({
  count: async () => {
    return await db.$count(schema.users);
  },
  create: async (user: typeof schema.users.$inferInsert) => {
    const [userData] = await db.insert(schema.users).values(user).returning();
    return userData;
  },
  findMany: async () => {
    return await db.query.users.findMany();
  },
});
