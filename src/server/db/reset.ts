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
import { db } from "./index";

async function resetDatabase() {
  console.log("🚀 Starting database reset...");

  try {
    // Drop all tables (cascade will drop dependent objects)
    console.log("🗑️  Dropping all tables...");

    await db.execute(sql`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);

    console.log("✅ All tables dropped successfully");
    console.log("");
    console.log("📋 Next steps:");
    console.log("  1. Run: bun run db:push");
    console.log("  2. Run: bun run db:seed");
    console.log("");
    console.log("💡 Or use the combined command: bun run db:reset:full");

  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

resetDatabase();
