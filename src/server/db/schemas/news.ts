import type { JSONContent } from "@tiptap/react";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { directoryTags } from "./directory";
import { users } from "./users";

// ============================================================================
// Enums
// ============================================================================

export const newsTypeEnum = pgEnum("news_type_enum", [
  "announcement", // Объявление
  "event", // Мероприятие
  "maintenance", // Технические работы
  "update", // Обновление
  "community", // Сообщество
  "urgent", // Срочное
]);

export const newsStatusEnum = pgEnum("news_status_enum", [
  "draft", // Черновик
  "scheduled", // Запланирована
  "published", // Опубликована
  "archived", // В архиве
]);

// ============================================================================
// News Table
// ============================================================================

export const news = createTable(
  "news",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Basic info
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"), // Краткое описание для карточки

    // Media
    coverImage: varchar("cover_image", { length: 500 }), // URL обложки

    // Content (TipTap JSON)
    content: jsonb("content").$type<JSONContent>().notNull(),

    // Classification
    type: newsTypeEnum("type").notNull().default("announcement"),
    status: newsStatusEnum("status").notNull().default("draft"),

    // Publishing
    publishAt: timestamp("publish_at", { withTimezone: true }), // Дата публикации

    // Flags
    isPinned: boolean("is_pinned").notNull().default(false), // Закреплено
    isHighlighted: boolean("is_highlighted").notNull().default(false), // Выделено
    isAnonymous: boolean("is_anonymous").notNull().default(false), // От имени ресурса (без автора)

    // Author
    authorId: varchar("author_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("news_slug_idx").on(table.slug),
    index("news_status_idx").on(table.status),
    index("news_type_idx").on(table.type),
    index("news_publish_at_idx").on(table.publishAt),
    index("news_author_idx").on(table.authorId),
  ]
);

// ============================================================================
// News Tags (junction table)
// ============================================================================

export const newsTags = createTable(
  "news_tag",
  {
    newsId: uuid("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => directoryTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.newsId, table.tagId] }),
    index("news_tag_news_idx").on(table.newsId),
    index("news_tag_tag_idx").on(table.tagId),
  ]
);

// ============================================================================
// Relations
// ============================================================================

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
  newsTags: many(newsTags),
}));

export const newsTagsRelations = relations(newsTags, ({ one }) => ({
  news: one(news, {
    fields: [newsTags.newsId],
    references: [news.id],
  }),
  tag: one(directoryTags, {
    fields: [newsTags.tagId],
    references: [directoryTags.id],
  }),
}));

// ============================================================================
// Types
// ============================================================================

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type NewsType = (typeof newsTypeEnum.enumValues)[number];
export type NewsStatus = (typeof newsStatusEnum.enumValues)[number];
