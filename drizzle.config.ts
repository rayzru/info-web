import { type Config, defineConfig } from "drizzle-kit";

import { env } from "@sr2/env";

console.log('DB:', env.DATABASE_URL, env.DATABASE_NAME);
export default defineConfig({
  out: './drizzle',
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: env.DATABASE_NAME,
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: false,
  tablesFilter: ["sr2-community_*"],
} satisfies Config);
