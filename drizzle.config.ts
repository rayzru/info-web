import { type Config, defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: env.DATABASE_NAME,
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: false,
  tablesFilter: ["*"],
} satisfies Config);
