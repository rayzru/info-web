import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { apartments } from "./buildings";
import { createTable } from "./create-table";
import { parkingSpots } from "./parkings";
import { users } from "./users";

// Типы объявлений
export const listingTypeEnum = pgEnum("listing_type", [
  "rent", // Аренда
  "sale", // Продажа
]);

// Типы объектов в объявлениях
export const listingPropertyTypeEnum = pgEnum("listing_property_type", [
  "apartment", // Квартира
  "parking", // Парковка
]);

// Статусы модерации объявлений
export const listingStatusEnum = pgEnum("listing_status", [
  "draft", // Черновик
  "pending_moderation", // На модерации
  "approved", // Одобрено
  "rejected", // Отклонено
  "archived", // Архивировано (снято с публикации)
]);

// Причины архивирования
export const archiveReasonEnum = pgEnum("listing_archive_reason", [
  "manual", // Снято пользователем вручную
  "expired", // Истёк срок (4 недели)
  "rights_revoked", // Отозваны права на собственность
  "admin", // Снято администратором
]);

// Таблица объявлений
export const listings = createTable(
  "listing",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Владелец объявления
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Тип объявления: аренда или продажа
    listingType: listingTypeEnum("listing_type").notNull(),
    // Тип собственности
    propertyType: listingPropertyTypeEnum("property_type").notNull(),
    // Ссылки на объекты (одна будет заполнена)
    apartmentId: varchar("apartment_id", { length: 255 }).references(
      () => apartments.id,
      { onDelete: "cascade" }
    ),
    parkingSpotId: varchar("parking_spot_id", { length: 255 }).references(
      () => parkingSpots.id,
      { onDelete: "cascade" }
    ),
    // Заголовок объявления
    title: varchar("title", { length: 255 }).notNull(),
    // Описание
    description: text("description"),
    // Цена (в рублях) - для продажи это цена, для аренды - в месяц включая коммунальные
    price: integer("price").notNull(),
    // Включены ли коммунальные в цену аренды
    utilitiesIncluded: boolean("utilities_included").default(true),
    // Контактные предпочтения (какие способы связи показывать)
    showPhone: boolean("show_phone").notNull().default(true),
    showTelegram: boolean("show_telegram").notNull().default(false),
    showMax: boolean("show_max").notNull().default(false),
    showWhatsapp: boolean("show_whatsapp").notNull().default(false),
    // Статус модерации
    status: listingStatusEnum("status").notNull().default("draft"),
    // Модератор, рассмотревший объявление
    moderatedBy: varchar("moderated_by", { length: 255 }).references(
      () => users.id
    ),
    moderatedAt: timestamp("moderated_at", { mode: "date", withTimezone: true }),
    // Причина отклонения (если отклонено)
    rejectionReason: text("rejection_reason"),
    // Флаг устаревания (после 3 недель публикации)
    isStale: boolean("is_stale").notNull().default(false),
    // Когда объявление стало устаревшим
    staleAt: timestamp("stale_at", { mode: "date", withTimezone: true }),
    // Тип причины архивирования
    archiveReason: archiveReasonEnum("archive_reason"),
    // Дополнительный комментарий к архивированию
    archivedComment: text("archived_comment"),
    // Кем архивировано (если архивировано администратором)
    archivedBy: varchar("archived_by", { length: 255 }).references(
      () => users.id
    ),
    archivedAt: timestamp("archived_at", { mode: "date", withTimezone: true }),
    // Дата последнего продления объявления
    renewedAt: timestamp("renewed_at", { mode: "date", withTimezone: true }),
    // Счётчик просмотров
    viewCount: integer("view_count").notNull().default(0),
    // Временные метки
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    // Дата публикации (когда было одобрено)
    publishedAt: timestamp("published_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    index("listing_user_idx").on(table.userId),
    index("listing_status_idx").on(table.status),
    index("listing_type_idx").on(table.listingType),
    index("listing_property_type_idx").on(table.propertyType),
  ]
);

// Таблица фотографий объявлений (до 20 штук)
export const listingPhotos = createTable(
  "listing_photo",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    listingId: varchar("listing_id", { length: 255 })
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    // URL фотографии
    url: varchar("url", { length: 500 }).notNull(),
    // Порядок отображения
    sortOrder: smallint("sort_order").notNull().default(0),
    // Является ли главной фотографией
    isMain: boolean("is_main").notNull().default(false),
    // Альтернативный текст для доступности
    altText: varchar("alt_text", { length: 255 }),
    // Временная метка загрузки
    uploadedAt: timestamp("uploaded_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("listing_photo_listing_idx").on(table.listingId)]
);

// Связи
export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  apartment: one(apartments, {
    fields: [listings.apartmentId],
    references: [apartments.id],
  }),
  parkingSpot: one(parkingSpots, {
    fields: [listings.parkingSpotId],
    references: [parkingSpots.id],
  }),
  moderator: one(users, {
    fields: [listings.moderatedBy],
    references: [users.id],
  }),
  photos: many(listingPhotos),
}));

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPhotos.listingId],
    references: [listings.id],
  }),
}));
