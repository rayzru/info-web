import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { buildings } from "./buildings";
import { createTable } from "./create-table";

// ============== ENUMS ==============

export const directoryEntryTypeEnum = pgEnum("directory_entry_type", [
  "contact", // УК, ЖКХ, экстренные службы
  "organization", // Магазины, кафе, сервисы
  "location", // Локации в ЖК (площадки, кладовки)
  "document", // Документы и инструкции
]);

export const directoryContactTypeEnum = pgEnum("directory_contact_type", [
  "phone",
  "email",
  "address",
  "telegram",
  "whatsapp",
  "website",
  "vk",
  "other",
]);

export const directoryScopeEnum = pgEnum("directory_scope", [
  "core", // ЖК-related: УК, здания, коммуникации, аварийные службы
  "commerce", // Арендаторы на территории ЖК (магазины, кафе)
  "city", // Внешняя городская инфраструктура (больницы, школы, полиция)
  "promoted", // Платные рекламные размещения
]);

// ============== DIRECTORY ENTRY ==============

export const directoryEntries = createTable(
  "directory_entry",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    type: directoryEntryTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }),
    description: text("description"),
    content: text("content"), // Rich text / markdown
    buildingId: varchar("building_id", { length: 255 }).references(
      () => buildings.id,
      { onDelete: "set null" }
    ),
    // Для организаций - этаж
    floorNumber: smallint("floor_number"),
    // Иконка (Lucide icon name)
    icon: varchar("icon", { length: 50 }),
    // Порядок сортировки
    order: integer("order").default(0),
    // Активность записи
    isActive: integer("is_active").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("directory_entry_type_idx").on(table.type),
    index("directory_entry_slug_idx").on(table.slug),
    index("directory_entry_building_idx").on(table.buildingId),
  ]
);

// ============== DIRECTORY CONTACTS ==============

export const directoryContacts = createTable(
  "directory_contact",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    entryId: varchar("entry_id", { length: 255 })
      .notNull()
      .references(() => directoryEntries.id, { onDelete: "cascade" }),
    type: directoryContactTypeEnum("type").notNull(),
    value: varchar("value", { length: 500 }).notNull(),
    label: varchar("label", { length: 100 }), // "Диспетчерская", "Приёмная"
    // Подзаголовок - ФИО, должность
    subtitle: varchar("subtitle", { length: 255 }),
    isPrimary: integer("is_primary").notNull().default(0),
    order: integer("order").default(0),
    // Флаги мессенджеров (для телефонов)
    hasWhatsApp: integer("has_whatsapp").notNull().default(0),
    hasTelegram: integer("has_telegram").notNull().default(0),
    // График работы контакта
    is24h: integer("is_24h").notNull().default(0), // Круглосуточно
    scheduleNote: varchar("schedule_note", { length: 255 }), // "Пн-Пт 9:00-18:00"
  },
  (table) => [
    index("directory_contact_entry_idx").on(table.entryId),
    index("directory_contact_type_idx").on(table.type),
  ]
);

// ============== DIRECTORY SCHEDULE ==============

export const directorySchedules = createTable(
  "directory_schedule",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    entryId: varchar("entry_id", { length: 255 })
      .notNull()
      .references(() => directoryEntries.id, { onDelete: "cascade" }),
    dayOfWeek: smallint("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
    openTime: time("open_time"),
    closeTime: time("close_time"),
    note: varchar("note", { length: 255 }), // "обед 13:00-14:00", "выходной"
  },
  (table) => [index("directory_schedule_entry_idx").on(table.entryId)]
);

// ============== DIRECTORY TAGS ==============

export const directoryTags = createTable(
  "directory_tag",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    parentId: varchar("parent_id", { length: 255 }),
    // Scope определяет область видимости: core (ЖК), commerce (арендаторы), city (город), promoted (реклама)
    scope: directoryScopeEnum("scope").notNull().default("core"),
    // Синонимы для поиска (JSON array как TEXT)
    synonyms: text("synonyms"), // JSON: ["водопровод", "трубы", "краны"]
    icon: varchar("icon", { length: 50 }), // Lucide icon name
    order: integer("order").default(0),
  },
  (table) => [
    index("directory_tag_slug_idx").on(table.slug),
    index("directory_tag_parent_idx").on(table.parentId),
    index("directory_tag_scope_idx").on(table.scope),
  ]
);

// ============== DIRECTORY ENTRY TAGS (junction) ==============

export const directoryEntryTags = createTable(
  "directory_entry_tag",
  {
    entryId: varchar("entry_id", { length: 255 })
      .notNull()
      .references(() => directoryEntries.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => directoryTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.entryId, table.tagId] }),
    index("directory_entry_tag_entry_idx").on(table.entryId),
    index("directory_entry_tag_tag_idx").on(table.tagId),
  ]
);

// ============== DIRECTORY CONTACT TAGS (junction) ==============

export const directoryContactTags = createTable(
  "directory_contact_tag",
  {
    contactId: varchar("contact_id", { length: 255 })
      .notNull()
      .references(() => directoryContacts.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => directoryTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.contactId, table.tagId] }),
    index("directory_contact_tag_contact_idx").on(table.contactId),
    index("directory_contact_tag_tag_idx").on(table.tagId),
  ]
);

// ============== ANALYTICS / STATISTICS ==============

// Enum для типов событий
export const directoryEventTypeEnum = pgEnum("directory_event_type", [
  "search", // Поисковый запрос
  "tag_click", // Клик по тегу
  "entry_view", // Просмотр записи
  "entry_call", // Клик по телефону
  "entry_link", // Клик по ссылке
]);

// Универсальный лог событий
export const directoryAnalytics = createTable(
  "directory_analytics",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    eventType: directoryEventTypeEnum("event_type").notNull(),
    // Для search - query, для остальных - null
    searchQuery: varchar("search_query", { length: 255 }),
    // Опциональные связи - заполняются в зависимости от типа события
    tagId: varchar("tag_id", { length: 255 }).references(() => directoryTags.id, {
      onDelete: "set null",
    }),
    entryId: varchar("entry_id", { length: 255 }).references(
      () => directoryEntries.id,
      { onDelete: "set null" }
    ),
    // Контакт, по которому кликнули (для entry_call, entry_link)
    contactId: varchar("contact_id", { length: 255 }).references(
      () => directoryContacts.id,
      { onDelete: "set null" }
    ),
    // Пользователь (если авторизован)
    userId: varchar("user_id", { length: 255 }),
    // Количество результатов поиска (для search)
    resultsCount: integer("results_count"),
    // Метаданные (user agent, etc.)
    metadata: text("metadata"), // JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("directory_analytics_event_type_idx").on(table.eventType),
    index("directory_analytics_tag_idx").on(table.tagId),
    index("directory_analytics_entry_idx").on(table.entryId),
    index("directory_analytics_user_idx").on(table.userId),
    index("directory_analytics_created_idx").on(table.createdAt),
  ]
);

// Агрегированная статистика по тегам (обновляется периодически)
export const directoryTagStats = createTable(
  "directory_tag_stats",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => directoryTags.id, { onDelete: "cascade" })
      .unique(),
    // Счетчики
    clickCount: integer("click_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0), // Просмотры записей с этим тегом
    // Временные метки
    lastClickedAt: timestamp("last_clicked_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("directory_tag_stats_clicks_idx").on(table.clickCount),
    index("directory_tag_stats_views_idx").on(table.viewCount),
  ]
);

// Агрегированная статистика по записям
export const directoryEntryStats = createTable(
  "directory_entry_stats",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    entryId: varchar("entry_id", { length: 255 })
      .notNull()
      .references(() => directoryEntries.id, { onDelete: "cascade" })
      .unique(),
    // Счетчики
    viewCount: integer("view_count").notNull().default(0),
    callCount: integer("call_count").notNull().default(0), // Клики по телефону
    linkCount: integer("link_count").notNull().default(0), // Клики по ссылкам
    // Временные метки
    lastViewedAt: timestamp("last_viewed_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("directory_entry_stats_views_idx").on(table.viewCount),
    index("directory_entry_stats_calls_idx").on(table.callCount),
  ]
);

// ============== RELATIONS ==============

export const directoryEntriesRelations = relations(
  directoryEntries,
  ({ one, many }) => ({
    building: one(buildings, {
      fields: [directoryEntries.buildingId],
      references: [buildings.id],
    }),
    contacts: many(directoryContacts),
    schedules: many(directorySchedules),
    entryTags: many(directoryEntryTags),
  })
);

export const directoryContactsRelations = relations(
  directoryContacts,
  ({ one, many }) => ({
    entry: one(directoryEntries, {
      fields: [directoryContacts.entryId],
      references: [directoryEntries.id],
    }),
    contactTags: many(directoryContactTags),
  })
);

export const directorySchedulesRelations = relations(
  directorySchedules,
  ({ one }) => ({
    entry: one(directoryEntries, {
      fields: [directorySchedules.entryId],
      references: [directoryEntries.id],
    }),
  })
);

export const directoryTagsRelations = relations(
  directoryTags,
  ({ one, many }) => ({
    parent: one(directoryTags, {
      fields: [directoryTags.parentId],
      references: [directoryTags.id],
      relationName: "tagHierarchy",
    }),
    children: many(directoryTags, {
      relationName: "tagHierarchy",
    }),
    entryTags: many(directoryEntryTags),
    contactTags: many(directoryContactTags),
  })
);

export const directoryEntryTagsRelations = relations(
  directoryEntryTags,
  ({ one }) => ({
    entry: one(directoryEntries, {
      fields: [directoryEntryTags.entryId],
      references: [directoryEntries.id],
    }),
    tag: one(directoryTags, {
      fields: [directoryEntryTags.tagId],
      references: [directoryTags.id],
    }),
  })
);

export const directoryContactTagsRelations = relations(
  directoryContactTags,
  ({ one }) => ({
    contact: one(directoryContacts, {
      fields: [directoryContactTags.contactId],
      references: [directoryContacts.id],
    }),
    tag: one(directoryTags, {
      fields: [directoryContactTags.tagId],
      references: [directoryTags.id],
    }),
  })
);

// Analytics relations
export const directoryAnalyticsRelations = relations(
  directoryAnalytics,
  ({ one }) => ({
    tag: one(directoryTags, {
      fields: [directoryAnalytics.tagId],
      references: [directoryTags.id],
    }),
    entry: one(directoryEntries, {
      fields: [directoryAnalytics.entryId],
      references: [directoryEntries.id],
    }),
    contact: one(directoryContacts, {
      fields: [directoryAnalytics.contactId],
      references: [directoryContacts.id],
    }),
  })
);

export const directoryTagStatsRelations = relations(
  directoryTagStats,
  ({ one }) => ({
    tag: one(directoryTags, {
      fields: [directoryTagStats.tagId],
      references: [directoryTags.id],
    }),
  })
);

export const directoryEntryStatsRelations = relations(
  directoryEntryStats,
  ({ one }) => ({
    entry: one(directoryEntries, {
      fields: [directoryEntryStats.entryId],
      references: [directoryEntries.id],
    }),
  })
);
