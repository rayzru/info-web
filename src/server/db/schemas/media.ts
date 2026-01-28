import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users } from "./users";

// ============================================================================
// Enums
// ============================================================================

export const mediaTypeEnum = pgEnum("media_type_enum", [
  "image",
  "document",
  "video",
  "other",
]);

// ============================================================================
// Media Table
// ============================================================================

export const media = createTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // File info
    filename: varchar("filename", { length: 255 }).notNull(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(), // bytes

    // Path and URL
    path: varchar("path", { length: 500 }).notNull(), // relative path from public
    url: varchar("url", { length: 500 }).notNull(), // full URL path

    // Image specific
    width: integer("width"),
    height: integer("height"),

    // Classification
    type: mediaTypeEnum("type").notNull().default("image"),

    // Optional metadata
    alt: varchar("alt", { length: 255 }), // alt text for accessibility
    title: varchar("title", { length: 255 }), // title/caption
    description: text("description"),

    // Ownership
    uploadedBy: varchar("uploaded_by", { length: 255 })
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("media_uploaded_by_idx").on(table.uploadedBy),
    index("media_type_idx").on(table.type),
    index("media_created_at_idx").on(table.createdAt),
    index("media_mime_type_idx").on(table.mimeType),
  ]
);

// ============================================================================
// Media Tags Table
// ============================================================================

export const mediaTags = createTable(
  "media_tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 7 }), // hex color like #FF5733

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("media_tag_slug_idx").on(table.slug),
  ]
);

// ============================================================================
// Media to Tags Junction Table (Many-to-Many)
// ============================================================================

export const mediaToTags = createTable(
  "media_to_tag",
  {
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => mediaTags.id, { onDelete: "cascade" }),

    // When tag was added
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.mediaId, table.tagId] }),
    index("media_to_tag_media_idx").on(table.mediaId),
    index("media_to_tag_tag_idx").on(table.tagId),
  ]
);

// ============================================================================
// Relations
// ============================================================================

export const mediaRelations = relations(media, ({ one, many }) => ({
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
  tags: many(mediaToTags),
}));

export const mediaTagsRelations = relations(mediaTags, ({ many }) => ({
  media: many(mediaToTags),
}));

export const mediaToTagsRelations = relations(mediaToTags, ({ one }) => ({
  media: one(media, {
    fields: [mediaToTags.mediaId],
    references: [media.id],
  }),
  tag: one(mediaTags, {
    fields: [mediaToTags.tagId],
    references: [mediaTags.id],
  }),
}));

// ============================================================================
// Types
// ============================================================================

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type MediaType = (typeof mediaTypeEnum.enumValues)[number];

export type MediaTag = typeof mediaTags.$inferSelect;
export type NewMediaTag = typeof mediaTags.$inferInsert;

export type MediaToTag = typeof mediaToTags.$inferSelect;
export type NewMediaToTag = typeof mediaToTags.$inferInsert;
