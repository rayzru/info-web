import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";

// ============================================================================
// System Settings Table
// ============================================================================

/**
 * Key-value store for system-wide settings
 * Each setting has a unique key and stores its value as JSON
 */
export const systemSettings = createTable("system_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

// ============================================================================
// Maintenance Mode Settings Type
// ============================================================================

export interface MaintenanceSettings {
  enabled: boolean;
  message?: string;
  expectedEndTime?: string; // ISO date string
  allowedIps?: string[]; // IPs that bypass maintenance
}

// ============================================================================
// Types
// ============================================================================

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;

// ============================================================================
// Setting Keys Constants
// ============================================================================

export const SETTING_KEYS = {
  MAINTENANCE_MODE: "maintenance_mode",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
