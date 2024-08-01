import { type Config } from "drizzle-kit";

import { env } from "@sr2/env";

console.log('DB:', env.DATABASE_URL);
export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: false,
  tablesFilter: ["sr2-community_*"],
} satisfies Config;
