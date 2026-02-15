/**
 * Database Seed Script
 *
 * This script populates the database with initial data from the seed SQL file.
 *
 * Usage:
 *   bun run db:seed
 */

import { readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";

import { env } from "~/env";
import { logger } from "~/lib/logger";

async function seedDatabase() {
  logger.info("🌱 Starting database seeding...");

  // Create a direct postgres connection for multi-statement execution
  const sql = postgres(env.DATABASE_URL, { max: 1 });

  try {
    // Read the seed SQL file
    const seedFile = join(process.cwd(), "drizzle", "0001_seed-data.sql");
    const seedSQL = readFileSync(seedFile, "utf-8");

    logger.info("📂 Loading seed data from: drizzle/0001_seed-data.sql");

    // Execute the seed SQL using postgres driver (supports multi-statement)
    await sql.unsafe(seedSQL);

    logger.info("✅ Database seeded successfully!");
    logger.info("");
    logger.info("📊 Seed data includes:");
    logger.info("  • 7 Buildings (Строение 1-7)");
    logger.info("  • Multiple entrances and floors");
    logger.info("  • Hundreds of apartments (studio, 1k, 2k, 3k types)");
    logger.info("  • 4 Underground parking structures");
    logger.info("  • 794 total parking spots");
    logger.info("");
    logger.info("🎉 Ready to use! Try: bun run db:studio");
  } catch (error) {
    if (error instanceof Error) {
      // Check if error is due to data already existing
      if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
        logger.info("⚠️  Database already contains seed data");
        logger.info("💡 To reseed, run: bun run db:reset:full");
      } else {
        logger.error("❌ Error seeding database:", error.message);
        process.exit(1);
      }
    } else {
      logger.error("❌ Unknown error:", error);
      process.exit(1);
    }
  } finally {
    await sql.end();
    process.exit(0);
  }
}

seedDatabase();
