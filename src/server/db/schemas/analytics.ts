import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgEnum, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users } from "./users";

// Event types for categorization
export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "page_view", // Page visits
  "action", // User actions (clicks, form submissions)
  "conversion", // Business events (registration, claim, publication)
]);

// Device types
export const analyticsDeviceTypeEnum = pgEnum("analytics_device_type", [
  "desktop",
  "mobile",
  "tablet",
  "unknown",
]);

/**
 * Analytics Sessions
 *
 * Groups events by user session for better analysis.
 * A session expires after 30 minutes of inactivity.
 */
export const analyticsSessions = createTable(
  "analytics_session",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // User info (nullable for anonymous users)
    userId: varchar("user_id", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),

    // Session timing
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    // Device info
    deviceType: analyticsDeviceTypeEnum("device_type").notNull().default("unknown"),
    browser: varchar("browser", { length: 100 }),
    os: varchar("os", { length: 100 }),
    screenResolution: varchar("screen_resolution", { length: 20 }),

    // Entry info
    entryPage: varchar("entry_page", { length: 500 }).notNull(),
    referrer: varchar("referrer", { length: 1000 }),

    // UTM tracking
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),
    utmTerm: varchar("utm_term", { length: 100 }),
    utmContent: varchar("utm_content", { length: 100 }),

    // Location (from IP, optional)
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 100 }),
  },
  (table) => [
    index("analytics_session_user_id_idx").on(table.userId),
    index("analytics_session_started_at_idx").on(table.startedAt),
    index("analytics_session_device_type_idx").on(table.deviceType),
  ]
);

/**
 * Analytics Events
 *
 * Individual events tracked in the application.
 * Links to session for grouping.
 */
export const analyticsEvents = createTable(
  "analytics_event",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Session and user links
    sessionId: uuid("session_id")
      .notNull()
      .references(() => analyticsSessions.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),

    // Event classification
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    eventName: varchar("event_name", { length: 100 }).notNull(),
    eventCategory: varchar("event_category", { length: 50 }),

    // Page info
    pagePath: varchar("page_path", { length: 500 }).notNull(),
    pageTitle: varchar("page_title", { length: 200 }),

    // Referrer for this specific page view
    referrer: varchar("referrer", { length: 1000 }),

    // Additional event data (flexible JSON)
    properties: jsonb("properties").$type<Record<string, unknown>>(),

    // Timing
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    // Performance metrics (optional)
    loadTimeMs: varchar("load_time_ms", { length: 10 }),
  },
  (table) => [
    index("analytics_event_session_id_idx").on(table.sessionId),
    index("analytics_event_user_id_idx").on(table.userId),
    index("analytics_event_type_idx").on(table.eventType),
    index("analytics_event_name_idx").on(table.eventName),
    index("analytics_event_page_path_idx").on(table.pagePath),
    index("analytics_event_created_at_idx").on(table.createdAt),
    // Composite index for common queries
    index("analytics_event_type_created_at_idx").on(table.eventType, table.createdAt),
  ]
);

/**
 * Analytics Conversions
 *
 * Predefined conversion goals for tracking funnel completion.
 */
export const analyticsConversions = createTable(
  "analytics_conversion",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Conversion definition
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 500 }),
    eventName: varchar("event_name", { length: 100 }).notNull(),

    // Value tracking (optional)
    defaultValue: varchar("default_value", { length: 20 }),

    // Status
    isActive: timestamp("is_active", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("analytics_conversion_event_name_idx").on(table.eventName)]
);

// Relations
export const analyticsSessionsRelations = relations(analyticsSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [analyticsSessions.userId],
    references: [users.id],
  }),
  events: many(analyticsEvents),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  session: one(analyticsSessions, {
    fields: [analyticsEvents.sessionId],
    references: [analyticsSessions.id],
  }),
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
}));
