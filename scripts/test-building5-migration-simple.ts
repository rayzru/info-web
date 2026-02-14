/**
 * Simple test script for Building 5 apartments migration
 * Uses direct DATABASE_URL from .env
 */

import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import postgres from "postgres";

// Load .env
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment");
  console.log("💡 Make sure .env file exists");
  process.exit(1);
}

async function testMigration() {
  console.log("🧪 Testing Building 5 apartments migration...\n");

  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), "drizzle", "0026_add_building5_apartments.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("📂 Migration file loaded successfully");
    console.log("📊 Checking current state...\n");

    // Check if Building 5 exists
    const building = await sql`
      SELECT id, number, title, liter
      FROM building
      WHERE number = 5
    `;

    if (building.length === 0) {
      console.error("❌ Building 5 not found in database!");
      console.log("💡 Run: bun run db:seed first");
      process.exit(1);
    }

    console.log(`✓ Building 5 found: ${building[0]!.title} (${building[0]!.liter})`);

    // Check entrances
    const entrances = await sql`
      SELECT e.entrance_number, COUNT(f.id) as floor_count
      FROM entrance e
      JOIN building b ON e.building_id = b.id
      LEFT JOIN floor f ON f.entrance_id = e.id
      WHERE b.number = 5
      GROUP BY e.entrance_number
      ORDER BY e.entrance_number
    `;

    console.log(`✓ Entrances: ${entrances.length}`);
    for (const entrance of entrances) {
      console.log(`  - Entrance ${entrance.entrance_number}: ${entrance.floor_count} floors`);
    }

    // Check current apartments
    const currentApartments = await sql`
      SELECT COUNT(a.id) as count
      FROM apartment a
      JOIN floor f ON a.floor_id = f.id
      JOIN entrance e ON f.entrance_id = e.id
      JOIN building b ON e.building_id = b.id
      WHERE b.number = 5
    `;

    const currentCount = Number(currentApartments[0]!.count);
    console.log(`\n📍 Current apartments in Building 5: ${currentCount}`);

    if (currentCount > 0) {
      console.warn("\n⚠️  WARNING: Building 5 already has apartments!");
      console.warn(`   Found ${currentCount} existing apartments.`);
      console.warn("   This migration will ADD 728 more apartments.");
      console.warn("\n   To remove existing apartments first, run:");
      console.warn("   DELETE FROM apartment WHERE floor_id IN (");
      console.warn("     SELECT f.id FROM floor f");
      console.warn("     JOIN entrance e ON f.entrance_id = e.id  ");
      console.warn("     JOIN building b ON e.building_id = b.id");
      console.warn("     WHERE b.number = 5");
      console.warn("   );");
      process.exit(1);
    }

    // Execute migration in a transaction (will be rolled back)
    console.log("\n🔄 Executing migration in test transaction...");

    await sql.begin(async (tx) => {
      // Execute migration
      await tx.unsafe(migrationSQL);

      // Verify results
      const results = await tx`
        SELECT
          b.number AS building,
          e.entrance_number AS entrance,
          COUNT(a.id) AS apartment_count,
          MIN(a.number::int) AS min_apt,
          MAX(a.number::int) AS max_apt
        FROM building b
        JOIN entrance e ON e.building_id = b.id
        LEFT JOIN floor f ON f.entrance_id = e.id
        LEFT JOIN apartment a ON a.floor_id = f.id
        WHERE b.number = 5
        GROUP BY b.number, e.entrance_number
        ORDER BY e.entrance_number
      `;

      console.log("\n✅ Migration executed successfully!\n");
      console.log("📊 Results:");
      console.log("─────────────────────────────────────────────");

      let totalApartments = 0;
      const expected = [
        { entrance: 1, count: 222, min: 1, max: 222 },
        { entrance: 2, count: 253, min: 223, max: 475 },
        { entrance: 3, count: 253, min: 476, max: 728 },
      ];

      let allPassed = true;

      for (const row of results) {
        const expectedData = expected.find(e => e.entrance === row.entrance);
        const countMatch = expectedData && Number(row.apartment_count) === expectedData.count;
        const rangeMatch = expectedData &&
          Number(row.min_apt) === expectedData.min &&
          Number(row.max_apt) === expectedData.max;

        const status = countMatch && rangeMatch ? "✓" : "✗";
        if (!countMatch || !rangeMatch) allPassed = false;

        console.log(`${status} Entrance ${row.entrance}: ${row.apartment_count} apartments (${row.min_apt}-${row.max_apt})`);

        if (expectedData) {
          if (!countMatch) {
            console.log(`  ⚠️  Expected ${expectedData.count} apartments`);
          }
          if (!rangeMatch) {
            console.log(`  ⚠️  Expected range ${expectedData.min}-${expectedData.max}`);
          }
        }

        totalApartments += Number(row.apartment_count);
      }

      console.log("─────────────────────────────────────────────");
      console.log(`Total: ${totalApartments} apartments`);

      const totalMatch = totalApartments === 728;
      console.log(`Expected: 728 apartments (${totalMatch ? "✓ PASS" : "✗ FAIL"})`);

      if (!allPassed || !totalMatch) {
        throw new Error("TEST_FAILED");
      }

      // Rollback transaction (no changes will be committed)
      throw new Error("ROLLBACK_TEST_TRANSACTION");
    });

  } catch (error) {
    if (error instanceof Error && error.message === "ROLLBACK_TEST_TRANSACTION") {
      console.log("\n🔙 Test transaction rolled back (no changes committed)");
      console.log("\n✅ Migration test PASSED!");
      console.log("\n📝 Next steps:");
      console.log("   1. Review the migration file: drizzle/0026_add_building5_apartments.sql");
      console.log("   2. When ready to apply:");
      console.log("      • Manually run the SQL file against your database");
      console.log("      • OR integrate it into your migration system");
      console.log("\n⚠️  IMPORTANT: Apartment types are set to '2k' as placeholder");
      console.log("   Update with actual types when building floor plans are available!");
    } else if (error instanceof Error && error.message === "TEST_FAILED") {
      console.error("\n❌ Migration test FAILED - results don't match expectations!");
      process.exit(1);
    } else {
      console.error("\n❌ Migration test FAILED!");
      console.error("Error:", error);
      process.exit(1);
    }
  } finally {
    await sql.end();
  }
}

testMigration();
