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

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // Create a direct postgres connection for multi-statement execution
  const sql = postgres(env.DATABASE_URL, { max: 1 });

  try {
    // Read the seed SQL file
    const seedFile = join(process.cwd(), "drizzle", "0001_seed-data.sql");
    const seedSQL = readFileSync(seedFile, "utf-8");

    console.log("📂 Loading seed data from: drizzle/0001_seed-data.sql");

    // Execute the seed SQL using postgres driver (supports multi-statement)
    await sql.unsafe(seedSQL);

    console.log("✅ Database seeded successfully!");
    console.log("");
    console.log("📊 Seed data includes:");
    console.log("  • 7 Buildings (Строение 1-7)");
    console.log("  • Multiple entrances and floors");
    console.log("  • Hundreds of apartments (studio, 1k, 2k, 3k types)");
    console.log("  • 4 Underground parking structures");
    console.log("  • 794 total parking spots");
    console.log("");
    console.log("🎉 Ready to use! Try: bun run db:studio");
  } catch (error) {
    if (error instanceof Error) {
      // Check if error is due to data already existing
      if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
        console.log("⚠️  Database already contains seed data");
        console.log("💡 To reseed, run: bun run db:reset:full");
      } else {
        console.error("❌ Error seeding database:", error.message);
        process.exit(1);
      }
    } else {
      console.error("❌ Unknown error:", error);
      process.exit(1);
    }
  } finally {
    await sql.end();
    process.exit(0);
  }
}

seedDatabase();
