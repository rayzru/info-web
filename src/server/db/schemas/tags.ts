import { relations, sql } from "drizzle-orm";
import { index, integer, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { news } from "./news";
import { publications } from "./publications";

// ============================================================================
// Unified Tags Table
// ============================================================================

/**
 * Единая упрощенная таблица тегов для контента
 *
 * Используется для: новостей, публикаций, статей базы знаний
 * НЕ используется для: медиа (медиа находит контекст через связи с контентом)
 */
export const infoTag = pgTable(
  "info_tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Основные поля
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),

    // Опциональный цвет для UI
    color: varchar("color", { length: 7 }), // HEX: #3b82f6

    // Статистика использования (автообновляется)
    usageCount: integer("usage_count").default(0).notNull(),

    // Timestamp
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("info_tag_slug_idx").on(table.slug),
    index("info_tag_usage_count_idx").on(table.usageCount),
  ]
);

// ============================================================================
// Junction Tables (Many-to-Many relationships)
// ============================================================================

/**
 * Новости ↔ Теги
 */
export const infoNewsToTag = pgTable(
  "info_news_to_tag",
  {
    newsId: uuid("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => infoTag.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.newsId, table.tagId] }),
    index("info_news_to_tag_news_idx").on(table.newsId),
    index("info_news_to_tag_tag_idx").on(table.tagId),
  ]
);

/**
 * Публикации ↔ Теги
 */
export const infoPublicationToTag = pgTable(
  "info_publication_to_tag",
  {
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => infoTag.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.publicationId, table.tagId] }),
    index("info_publication_to_tag_publication_idx").on(table.publicationId),
    index("info_publication_to_tag_tag_idx").on(table.tagId),
  ]
);

// ============================================================================
// Relations
// ============================================================================

export const infoTagRelations = relations(infoTag, ({ many }) => ({
  newsRelations: many(infoNewsToTag),
  publicationRelations: many(infoPublicationToTag),
}));

export const infoNewsToTagRelations = relations(infoNewsToTag, ({ one }) => ({
  news: one(news, {
    fields: [infoNewsToTag.newsId],
    references: [news.id],
  }),
  tag: one(infoTag, {
    fields: [infoNewsToTag.tagId],
    references: [infoTag.id],
  }),
}));

export const infoPublicationToTagRelations = relations(infoPublicationToTag, ({ one }) => ({
  publication: one(publications, {
    fields: [infoPublicationToTag.publicationId],
    references: [publications.id],
  }),
  tag: one(infoTag, {
    fields: [infoPublicationToTag.tagId],
    references: [infoTag.id],
  }),
}));

// ============================================================================
// Types
// ============================================================================

export type InfoTag = typeof infoTag.$inferSelect;
export type NewInfoTag = typeof infoTag.$inferInsert;

export type InfoNewsToTag = typeof infoNewsToTag.$inferSelect;
export type InfoPublicationToTag = typeof infoPublicationToTag.$inferSelect;
