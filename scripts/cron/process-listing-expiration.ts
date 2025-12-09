/**
 * Cron Job: Process Listing Expiration
 *
 * Runs daily to:
 * 1. Mark listings as stale after 3 weeks of publication
 * 2. Archive listings after 4 weeks of publication
 *
 * Usage: bun run scripts/cron/process-listing-expiration.ts
 * Cron: 0 3 * * * (daily at 3:00 AM)
 */

import { and, eq, isNull, lt, sql } from "drizzle-orm";

import { db } from "~/server/db";
import { listings } from "~/server/db/schema";

const STALE_THRESHOLD_DAYS = 21; // 3 weeks
const ARCHIVE_THRESHOLD_DAYS = 28; // 4 weeks

async function processListingExpiration() {
  const now = new Date();
  const staleDate = new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);
  const archiveDate = new Date(now.getTime() - ARCHIVE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

  console.log(`[${now.toISOString()}] Starting listing expiration processing...`);
  console.log(`  Stale threshold: ${staleDate.toISOString()} (${STALE_THRESHOLD_DAYS} days ago)`);
  console.log(`  Archive threshold: ${archiveDate.toISOString()} (${ARCHIVE_THRESHOLD_DAYS} days ago)`);

  try {
    // 1. Mark listings as stale (published > 3 weeks ago, not yet stale)
    // Use renewedAt if available, otherwise publishedAt
    const staleResult = await db
      .update(listings)
      .set({
        isStale: true,
        staleAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(listings.status, "approved"),
          eq(listings.isStale, false),
          // Check if (renewedAt OR publishedAt) < staleDate
          sql`COALESCE(${listings.renewedAt}, ${listings.publishedAt}) < ${staleDate}`
        )
      )
      .returning({ id: listings.id, title: listings.title });

    console.log(`  Marked ${staleResult.length} listings as stale:`);
    staleResult.forEach((l) => console.log(`    - ${l.id}: ${l.title}`));

    // 2. Archive listings that have been stale for more than 1 week (4 weeks total)
    const archiveResult = await db
      .update(listings)
      .set({
        status: "archived",
        archiveReason: "expired",
        archivedAt: now,
        archivedComment: "Automatically archived after 4 weeks without renewal",
        updatedAt: now,
      })
      .where(
        and(
          eq(listings.status, "approved"),
          eq(listings.isStale, true),
          // Check if (renewedAt OR publishedAt) < archiveDate
          sql`COALESCE(${listings.renewedAt}, ${listings.publishedAt}) < ${archiveDate}`
        )
      )
      .returning({ id: listings.id, title: listings.title });

    console.log(`  Archived ${archiveResult.length} expired listings:`);
    archiveResult.forEach((l) => console.log(`    - ${l.id}: ${l.title}`));

    console.log(`[${new Date().toISOString()}] Listing expiration processing completed.`);

    return {
      staleCount: staleResult.length,
      archivedCount: archiveResult.length,
    };
  } catch (error) {
    console.error("Error processing listing expiration:", error);
    throw error;
  }
}

// Run if executed directly
processListingExpiration()
  .then((result) => {
    console.log("Result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });

export { processListingExpiration };
