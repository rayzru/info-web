/**
 * Database Reset Script
 *
 * This script drops all tables and re-creates the database from scratch.
 * Use with caution - this will DELETE ALL DATA!
 *
 * Usage:
 *   bun run db:reset
 */

import { sql } from "drizzle-orm";

import { logger } from "~/lib/logger";

import { db } from "./index";

async function resetDatabase() {
  logger.info("🚀 Starting database reset...");

  try {
    // Drop all tables (cascade will drop dependent objects)
    logger.info("🗑️  Dropping all tables...");

    await db.execute(sql`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);

    logger.info("✅ All tables dropped successfully");
    logger.info("");
    logger.info("📋 Next steps:");
    logger.info("  1. Run: bun run db:push");
    logger.info("  2. Run: bun run db:seed");
    logger.info("");
    logger.info("💡 Or use the combined command: bun run db:reset:full");
  } catch (error) {
    logger.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

resetDatabase();
