import { sql } from "drizzle-orm";

import { logger } from "~/lib/logger";

import { db } from "./index";

async function migrateDirectory() {
  logger.info("Creating directory tables...");

  try {
    // Create enums
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE directory_contact_type AS ENUM('phone', 'email', 'address', 'telegram', 'whatsapp', 'website', 'vk', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE directory_entry_type AS ENUM('contact', 'organization', 'location', 'document');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE directory_scope AS ENUM('core', 'commerce', 'city', 'promoted');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    // Create directory_tag table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_tag" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL UNIQUE,
        "slug" varchar(100) NOT NULL UNIQUE,
        "description" text,
        "parent_id" varchar(255),
        "scope" directory_scope NOT NULL DEFAULT 'core',
        "synonyms" text,
        "icon" varchar(50),
        "order" integer DEFAULT 0
      )
    `);

    // Add description column if it doesn't exist (for existing tables)
    await db.execute(sql`
      ALTER TABLE "directory_tag"
      ADD COLUMN IF NOT EXISTS "description" text
    `);

    // Add scope column if it doesn't exist (for existing tables)
    await db.execute(sql`
      ALTER TABLE "directory_tag"
      ADD COLUMN IF NOT EXISTS "scope" directory_scope NOT NULL DEFAULT 'core'
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_tag_slug_idx" ON "directory_tag" ("slug")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_tag_parent_idx" ON "directory_tag" ("parent_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_tag_scope_idx" ON "directory_tag" ("scope")`
    );

    // Create directory_entry table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_entry" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "slug" varchar(255) NOT NULL UNIQUE,
        "type" directory_entry_type NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text,
        "content" text,
        "building_id" varchar(255) REFERENCES "building"("id") ON DELETE SET NULL,
        "floor_number" smallint,
        "icon" varchar(50),
        "order" integer DEFAULT 0,
        "is_active" integer DEFAULT 1 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_type_idx" ON "directory_entry" ("type")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_slug_idx" ON "directory_entry" ("slug")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_building_idx" ON "directory_entry" ("building_id")`
    );

    // Create directory_contact table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_contact" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "entry_id" varchar(255) NOT NULL REFERENCES "directory_entry"("id") ON DELETE CASCADE,
        "type" directory_contact_type NOT NULL,
        "value" varchar(500) NOT NULL,
        "label" varchar(100),
        "subtitle" varchar(255),
        "is_primary" integer DEFAULT 0 NOT NULL,
        "order" integer DEFAULT 0,
        "has_whatsapp" integer DEFAULT 0 NOT NULL,
        "has_telegram" integer DEFAULT 0 NOT NULL,
        "is_24h" integer DEFAULT 0 NOT NULL,
        "schedule_note" varchar(255)
      )
    `);

    // Add new columns if they don't exist (for existing tables)
    await db.execute(
      sql`ALTER TABLE "directory_contact" ADD COLUMN IF NOT EXISTS "subtitle" varchar(255)`
    );
    await db.execute(
      sql`ALTER TABLE "directory_contact" ADD COLUMN IF NOT EXISTS "has_whatsapp" integer DEFAULT 0 NOT NULL`
    );
    await db.execute(
      sql`ALTER TABLE "directory_contact" ADD COLUMN IF NOT EXISTS "has_telegram" integer DEFAULT 0 NOT NULL`
    );
    await db.execute(
      sql`ALTER TABLE "directory_contact" ADD COLUMN IF NOT EXISTS "is_24h" integer DEFAULT 0 NOT NULL`
    );
    await db.execute(
      sql`ALTER TABLE "directory_contact" ADD COLUMN IF NOT EXISTS "schedule_note" varchar(255)`
    );

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_contact_entry_idx" ON "directory_contact" ("entry_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_contact_type_idx" ON "directory_contact" ("type")`
    );

    // Create directory_schedule table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_schedule" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "entry_id" varchar(255) NOT NULL REFERENCES "directory_entry"("id") ON DELETE CASCADE,
        "day_of_week" smallint NOT NULL,
        "open_time" time,
        "close_time" time,
        "note" varchar(255)
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_schedule_entry_idx" ON "directory_schedule" ("entry_id")`
    );

    // Create directory_entry_tag junction table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_entry_tag" (
        "entry_id" varchar(255) NOT NULL REFERENCES "directory_entry"("id") ON DELETE CASCADE,
        "tag_id" varchar(255) NOT NULL REFERENCES "directory_tag"("id") ON DELETE CASCADE,
        PRIMARY KEY("entry_id", "tag_id")
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_tag_entry_idx" ON "directory_entry_tag" ("entry_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_tag_tag_idx" ON "directory_entry_tag" ("tag_id")`
    );

    // Create directory_contact_tag junction table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_contact_tag" (
        "contact_id" varchar(255) NOT NULL REFERENCES "directory_contact"("id") ON DELETE CASCADE,
        "tag_id" varchar(255) NOT NULL REFERENCES "directory_tag"("id") ON DELETE CASCADE,
        PRIMARY KEY("contact_id", "tag_id")
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_contact_tag_contact_idx" ON "directory_contact_tag" ("contact_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_contact_tag_tag_idx" ON "directory_contact_tag" ("tag_id")`
    );

    // Create event type enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE directory_event_type AS ENUM('search', 'tag_click', 'entry_view', 'entry_call', 'entry_link');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    // Create directory_analytics table (event log)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_analytics" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "event_type" directory_event_type NOT NULL,
        "search_query" varchar(255),
        "tag_id" varchar(255) REFERENCES "directory_tag"("id") ON DELETE SET NULL,
        "entry_id" varchar(255) REFERENCES "directory_entry"("id") ON DELETE SET NULL,
        "contact_id" varchar(255) REFERENCES "directory_contact"("id") ON DELETE SET NULL,
        "user_id" varchar(255),
        "results_count" integer,
        "metadata" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_analytics_event_type_idx" ON "directory_analytics" ("event_type")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_analytics_tag_idx" ON "directory_analytics" ("tag_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_analytics_entry_idx" ON "directory_analytics" ("entry_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_analytics_user_idx" ON "directory_analytics" ("user_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_analytics_created_idx" ON "directory_analytics" ("created_at")`
    );

    // Create directory_tag_stats table (aggregated stats)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_tag_stats" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "tag_id" varchar(255) NOT NULL UNIQUE REFERENCES "directory_tag"("id") ON DELETE CASCADE,
        "click_count" integer NOT NULL DEFAULT 0,
        "view_count" integer NOT NULL DEFAULT 0,
        "last_clicked_at" timestamp,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_tag_stats_clicks_idx" ON "directory_tag_stats" ("click_count")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_tag_stats_views_idx" ON "directory_tag_stats" ("view_count")`
    );

    // Create directory_entry_stats table (aggregated stats)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "directory_entry_stats" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "entry_id" varchar(255) NOT NULL UNIQUE REFERENCES "directory_entry"("id") ON DELETE CASCADE,
        "view_count" integer NOT NULL DEFAULT 0,
        "call_count" integer NOT NULL DEFAULT 0,
        "link_count" integer NOT NULL DEFAULT 0,
        "last_viewed_at" timestamp,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_stats_views_idx" ON "directory_entry_stats" ("view_count")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "directory_entry_stats_calls_idx" ON "directory_entry_stats" ("call_count")`
    );

    // ============== BUILDING CHANNELS ==============
    // Create channel_type enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE channel_type AS ENUM('telegram', 'max', 'whatsapp', 'vk', 'email', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    // Create building_channel table (system channels for notifications)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "building_channel" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "building_id" varchar(255) REFERENCES "building"("id") ON DELETE CASCADE,
        "channel_type" channel_type NOT NULL,
        "channel_id" varchar(500) NOT NULL,
        "name" varchar(255),
        "is_active" integer DEFAULT 1 NOT NULL,
        "is_primary" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "building_channel_building_idx" ON "building_channel" ("building_id")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "building_channel_type_idx" ON "building_channel" ("channel_type")`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS "building_channel_active_idx" ON "building_channel" ("is_active")`
    );

    logger.info("Directory and building_channel tables created successfully!");
  } catch (error) {
    logger.error("Error creating directory tables:", error);
    throw error;
  }

  process.exit(0);
}

migrateDirectory();
