/**
 * Script to create a test superadmin user for site inventory testing
 * Run with: bun run scripts/create-test-admin.ts
 *
 * IMPORTANT: This is for development/testing only. Remove after testing.
 */

import { db } from "../src/server/db";
import { users, userRoles, userProfiles, sessions } from "../src/server/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

const TEST_ADMIN = {
  id: "test-superadmin-inventory-2024",
  email: "test.admin@localhost.test",
  name: "Test SuperAdmin",
  password: "TestAdmin123!", // Will be hashed
};

async function main() {
  console.log("🔧 Creating test superadmin for site inventory...\n");

  // Check if test admin already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, TEST_ADMIN.id),
  });

  if (existingUser) {
    console.log("⚠️  Test admin already exists. Cleaning up and recreating...");

    // Delete existing sessions
    await db.delete(sessions).where(eq(sessions.userId, TEST_ADMIN.id));

    // Delete existing roles
    await db.delete(userRoles).where(eq(userRoles.userId, TEST_ADMIN.id));

    // Delete existing profile
    await db.delete(userProfiles).where(eq(userProfiles.userId, TEST_ADMIN.id));

    // Delete user
    await db.delete(users).where(eq(users.id, TEST_ADMIN.id));

    console.log("   Cleaned up existing test admin.\n");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(TEST_ADMIN.password, 10);

  // Create user
  await db.insert(users).values({
    id: TEST_ADMIN.id,
    email: TEST_ADMIN.email,
    name: TEST_ADMIN.name,
    emailVerified: new Date(),
    passwordHash,
    isDeleted: false,
  });
  console.log("✅ Created user:", TEST_ADMIN.email);

  // Assign all admin roles
  const adminRoles = ["Root", "SuperAdmin", "Admin", "Moderator", "Editor"] as const;

  for (const role of adminRoles) {
    await db.insert(userRoles).values({
      userId: TEST_ADMIN.id,
      role,
    });
  }
  console.log("✅ Assigned roles:", adminRoles.join(", "));

  // Create profile
  await db.insert(userProfiles).values({
    userId: TEST_ADMIN.id,
    firstName: "Test",
    lastName: "SuperAdmin",
    displayName: "Test SuperAdmin (Inventory)",
    tagline: "Тестовый суперадминистратор",
    taglineSetByAdmin: true,
  });
  console.log("✅ Created profile\n");

  // Create a test session that expires in 24 hours
  const sessionToken = `test-session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(sessions).values({
    sessionToken,
    userId: TEST_ADMIN.id,
    expires,
  });

  console.log("📋 Test Admin Credentials:");
  console.log("   Email:", TEST_ADMIN.email);
  console.log("   Password:", TEST_ADMIN.password);
  console.log("\n🔑 Session Token (for direct cookie injection):");
  console.log("   ", sessionToken);
  console.log("   Expires:", expires.toISOString());
  console.log("\n✨ Test admin ready for site inventory testing!");
  console.log("\n⚠️  Remember to run cleanup-test-admin.ts after testing!\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error creating test admin:", err);
  process.exit(1);
});
