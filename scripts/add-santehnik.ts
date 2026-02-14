/**
 * Script to add plumber (Santehnik) contact to directory
 *
 * Usage: bun run scripts/add-santehnik.ts
 */

import { db } from "../src/server/db";
import { directoryEntries, directoryContacts } from "../src/server/db/schema";

async function addSantehnik() {
  console.log("Adding plumber contact: Kashchev Alexey Petrovich...");

  try {
    // Create directory entry
    const [entry] = await db.insert(directoryEntries).values({
      slug: "santehnik-kashchev",
      type: "contact",
      title: "Сантехник",
      subtitle: "Кащеев Алексей Петрович",
      description: "Сантехник управляющей компании",
      isActive: 1,
      order: 0,
    }).returning();

    if (!entry) {
      throw new Error("Failed to create directory entry");
    }

    console.log(`✓ Created directory entry with ID: ${entry.id}`);

    // Add phone contact
    await db.insert(directoryContacts).values({
      entryId: entry.id,
      type: "phone",
      value: "8-951-516-26-46",
      label: "Телефон",
      subtitle: "Кащеев Алексей Петрович",
      isPrimary: 1,
      order: 0,
      hasWhatsApp: 0,
      hasTelegram: 0,
      is24h: 0,
    });

    console.log("✓ Added phone contact");

    // Add address contact
    await db.insert(directoryContacts).values({
      entryId: entry.id,
      type: "address",
      value: "Ларина 45/6",
      label: "Адрес",
      subtitle: "",
      isPrimary: 0,
      order: 1,
      hasWhatsApp: 0,
      hasTelegram: 0,
      is24h: 0,
    });

    console.log("✓ Added address contact");

    console.log("\n✅ Successfully added plumber contact!");
    console.log(`   View at: http://localhost:3000/info/santehnik-kashchev`);
    console.log(`   Edit at: http://localhost:3000/admin/directory/${entry.id}`);

  } catch (error) {
    console.error("❌ Error adding plumber contact:", error);
    throw error;
  }
}

// Run the script
addSantehnik()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
