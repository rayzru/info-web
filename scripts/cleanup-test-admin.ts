/**
 * Script to clean up test superadmin user after site inventory testing
 * Run with: bun run scripts/cleanup-test-admin.ts
 */

import { db } from "../src/server/db";
import { users, userRoles, userProfiles, sessions } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

const TEST_ADMIN_ID = "test-superadmin-inventory-2024";

async function main() {
  console.log("🧹 Cleaning up test superadmin...\n");

  // Delete sessions
  const deletedSessions = await db
    .delete(sessions)
    .where(eq(sessions.userId, TEST_ADMIN_ID))
    .returning();
  console.log(`   Deleted ${deletedSessions.length} session(s)`);

  // Delete roles
  const deletedRoles = await db
    .delete(userRoles)
    .where(eq(userRoles.userId, TEST_ADMIN_ID))
    .returning();
  console.log(`   Deleted ${deletedRoles.length} role(s)`);

  // Delete profile
  const deletedProfiles = await db
    .delete(userProfiles)
    .where(eq(userProfiles.userId, TEST_ADMIN_ID))
    .returning();
  console.log(`   Deleted ${deletedProfiles.length} profile(s)`);

  // Delete user
  const deletedUsers = await db
    .delete(users)
    .where(eq(users.id, TEST_ADMIN_ID))
    .returning();
  console.log(`   Deleted ${deletedUsers.length} user(s)`);

  if (deletedUsers.length > 0) {
    console.log("\n✅ Test admin cleaned up successfully!");
  } else {
    console.log("\n⚠️  Test admin was not found (already cleaned up?)");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error cleaning up test admin:", err);
  process.exit(1);
});
