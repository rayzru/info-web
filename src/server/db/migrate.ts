#!/usr/bin/env bun
/**
 * Production database migration script
 *
 * Runs Drizzle ORM migrations programmatically without requiring drizzle-kit.
 * This avoids issues with TypeScript path aliases in drizzle.config.ts on the server.
 *
 * Usage: bun run src/server/db/migrate.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigrations() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔄 Connecting to database...");

  // Create postgres client for migrations
  const migrationClient = postgres(DATABASE_URL, { max: 1 });

  try {
    console.log("🔄 Running migrations from drizzle/ directory...");

    const db = drizzle(migrationClient);

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Migrations completed successfully");

    await migrationClient.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await migrationClient.end();
    process.exit(1);
  }
}

runMigrations().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
