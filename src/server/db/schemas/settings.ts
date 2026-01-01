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
// Publication Moderation Settings Type
// ============================================================================

export interface PublicationModerationSettings {
  /** Включена ли многоуровневая модерация */
  enabled: boolean;
  /** Минимальное количество одобрений для публикации */
  requiredApprovals: number;
  /** Роли, которые могут участвовать в модерации */
  allowedRoles: string[];
  /** Максимальное количество отклонений до автоотклонения */
  maxRejections: number;
  /** Разрешить автору видеть голоса модераторов */
  showVotesToAuthor: boolean;
  /** Требуется ли комментарий при одобрении */
  requireApprovalComment: boolean;
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
  PUBLICATION_MODERATION: "publication_moderation",
} as const;

/** Default values for publication moderation settings */
export const DEFAULT_PUBLICATION_MODERATION: PublicationModerationSettings = {
  enabled: true,
  requiredApprovals: 2,
  allowedRoles: ["Moderator", "Admin", "SuperAdmin", "Root"],
  maxRejections: 1,
  showVotesToAuthor: false,
  requireApprovalComment: false,
};

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
