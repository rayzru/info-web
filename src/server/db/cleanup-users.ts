/**
 * Database Cleanup Script
 *
 * This script removes all user-generated content while preserving structural data.
 *
 * KEEPS:
 * - Buildings, entrances, floors, apartments
 * - Parkings, parking floors, parking spots
 * - Organizations and their tags
 * - Directory entries (справочник)
 * - Knowledge base articles (howtos)
 * - Contact groups and properties
 * - System settings
 *
 * DELETES:
 * - Users and all related data (accounts, sessions, profiles, roles, blocks)
 * - News and publications
 * - Listings (marketplace)
 * - Messages and notifications
 * - Claims and feedback
 * - Audit logs
 * - Media uploads
 *
 * Usage:
 *   bun run db:cleanup
 */

import { sql } from "drizzle-orm";

import { db } from "./index";

// Helper to truncate table if it exists
async function truncateIfExists(tableName: string): Promise<void> {
  try {
    await db.execute(sql.raw(`TRUNCATE TABLE ${tableName} CASCADE`));
  } catch (error: unknown) {
    // Check for "relation does not exist" errors (code 42P01)
    // The error could be wrapped in DrizzleQueryError, so check cause too
    const isNotExistsError = (err: unknown): boolean => {
      if (!err || typeof err !== "object") return false;
      if ("code" in err && err.code === "42P01") return true;
      if ("cause" in err) return isNotExistsError(err.cause);
      return false;
    };

    if (isNotExistsError(error)) {
      // Table doesn't exist, skip silently
      return;
    }
    throw error;
  }
}

async function cleanupDatabase() {
  console.log("🧹 Starting database cleanup...");
  console.log("⚠️  This will DELETE all user content while preserving structural data!\n");

  try {
    // 1. Delete messages and related tables
    console.log("📧 Deleting messages...");
    await truncateIfExists("info_web_message_attachment");
    await truncateIfExists("info_web_message_recipient");
    await truncateIfExists("info_web_message_complaint");
    await truncateIfExists("info_web_message");
    await truncateIfExists("info_web_message_thread");
    await truncateIfExists("info_web_message_quota");

    // 2. Delete notifications
    console.log("🔔 Deleting notifications...");
    await truncateIfExists("info_web_notification");

    // 3. Delete publications
    console.log("📝 Deleting publications...");
    await truncateIfExists("info_web_publication_attachment");
    await truncateIfExists("info_web_publication_moderation_vote");
    await truncateIfExists("info_web_publication_history");
    await truncateIfExists("info_web_publication");

    // 4. Delete news
    console.log("📰 Deleting news...");
    await truncateIfExists("info_web_news_to_tag");
    await truncateIfExists("info_web_news");

    // 5. Delete listings
    console.log("🏷️ Deleting listings...");
    await truncateIfExists("info_web_listing_photo");
    await truncateIfExists("info_web_listing");

    // 6. Delete claims
    console.log("📋 Deleting claims...");
    await truncateIfExists("info_web_claim");

    // 7. Delete feedback
    console.log("💬 Deleting feedback...");
    await truncateIfExists("info_web_feedback");

    // 8. Delete audit logs
    console.log("📊 Deleting audit logs...");
    await truncateIfExists("info_web_audit_log");

    // 9. Delete media
    console.log("🖼️ Deleting media...");
    await truncateIfExists("info_web_media");

    // 10. Delete posts (T3 example)
    console.log("📄 Deleting posts...");
    await truncateIfExists("info_web_post");

    // 11. Delete deletion requests
    console.log("🗑️ Deleting deletion requests...");
    await truncateIfExists("info_web_deletion_request");

    // 12. Delete user-property relationships
    console.log("🔗 Deleting user-property relationships...");
    await truncateIfExists("info_web_user_apartment");
    await truncateIfExists("info_web_user_parking_spot");
    await truncateIfExists("info_web_user_interest_building");

    // 13. Delete user data
    console.log("👤 Deleting users and related data...");
    await truncateIfExists("info_web_user_block");
    await truncateIfExists("info_web_telegram_auth_token");
    await truncateIfExists("info_web_email_verification_token");
    await truncateIfExists("info_web_password_reset_token");
    await truncateIfExists("info_web_user_profile");
    await truncateIfExists("info_web_user_role");
    await truncateIfExists("info_web_session");
    await truncateIfExists("info_web_account");
    await truncateIfExists("info_web_verification_token");
    await truncateIfExists("info_web_user");

    console.log("\n✅ Database cleanup completed successfully!");
    console.log("\n📋 Preserved data:");
    console.log("  • Buildings, entrances, floors, apartments");
    console.log("  • Parkings and parking spots");
    console.log("  • Organizations");
    console.log("  • Directory entries (справочник)");
    console.log("  • Knowledge base articles (howtos)");
    console.log("  • Contact groups and properties");
    console.log("  • System settings");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

cleanupDatabase();
