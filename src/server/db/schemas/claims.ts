import { relations, sql } from "drizzle-orm";
import { index, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { apartments } from "./buildings";
import { createTable } from "./create-table";
import { organizations } from "./organizations";
import { parkingSpots } from "./parkings";
import { userRoleEnum, users } from "./users";

// Типы заявок на собственность
export const claimTypeEnum = pgEnum("claim_type", [
  "apartment", // Квартира
  "parking", // Парковка
  "commercial", // Коммерческая недвижимость
]);

// Статусы заявок
export const claimStatusEnum = pgEnum("claim_status", [
  "pending", // Ожидает рассмотрения
  "review", // На рассмотрении
  "approved", // Одобрена
  "rejected", // Отклонена
  "documents_requested", // Запрошены документы
]);

// Таблица заявок на собственность
export const propertyClaims = createTable(
  "property_claim",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    claimType: claimTypeEnum("claim_type").notNull(),
    // Заявляемая роль (собственник, проживающий и т.д.)
    claimedRole: userRoleEnum("claimed_role").notNull(),
    // Ссылки на конкретные объекты (одна из них будет заполнена в зависимости от типа)
    apartmentId: varchar("apartment_id", { length: 255 }).references(() => apartments.id, {
      onDelete: "cascade",
    }),
    parkingSpotId: varchar("parking_spot_id", { length: 255 }).references(() => parkingSpots.id, {
      onDelete: "cascade",
    }),
    organizationId: varchar("organization_id", { length: 255 }).references(() => organizations.id, {
      onDelete: "cascade",
    }),
    // Статус заявки
    status: claimStatusEnum("status").notNull().default("pending"),
    // Комментарий пользователя
    userComment: text("user_comment"),
    // Комментарий администратора (причина отклонения и т.д.)
    adminComment: text("admin_comment"),
    // Кто рассмотрел заявку
    reviewedBy: varchar("reviewed_by", { length: 255 }).references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { mode: "date", withTimezone: true }),
    // Временные метки
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("claim_user_idx").on(table.userId), index("claim_status_idx").on(table.status)]
);

// Типы решений (шаблоны)
export const resolutionTemplateEnum = pgEnum("resolution_template", [
  // Одобрение
  "approved_all_correct", // Все хорошо, все данные верны
  "approved_custom", // Свой текст
  // Отклонение
  "rejected_no_documents", // Подтверждающие документы не получены
  "rejected_invalid_documents", // Подтверждающие документы не верны
  "rejected_no_reason", // Отказ без объявления причины
  "rejected_custom", // Свой текст
]);

// Таблица истории изменений заявки
export const claimHistory = createTable(
  "claim_history",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    claimId: varchar("claim_id", { length: 255 })
      .notNull()
      .references(() => propertyClaims.id, { onDelete: "cascade" }),
    // Предыдущий статус
    fromStatus: claimStatusEnum("from_status"),
    // Новый статус
    toStatus: claimStatusEnum("to_status").notNull(),
    // Шаблон решения
    resolutionTemplate: resolutionTemplateEnum("resolution_template"),
    // Текст решения (заполняется из шаблона или вручную)
    resolutionText: text("resolution_text"),
    // Кто внес изменение
    changedBy: varchar("changed_by", { length: 255 }).references(() => users.id),
    // Когда внесено изменение
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("claim_history_claim_idx").on(table.claimId)]
);

// Таблица документов к заявке (макет для будущего функционала)
export const claimDocuments = createTable(
  "claim_document",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    claimId: varchar("claim_id", { length: 255 })
      .notNull()
      .references(() => propertyClaims.id, { onDelete: "cascade" }),
    // Тип документа (свидетельство о собственности, выписка ЕГРН, договор аренды)
    documentType: varchar("document_type", { length: 100 }).notNull(),
    // URL файла (будет заполняться когда определимся с хранилищем)
    fileUrl: varchar("file_url", { length: 500 }),
    // Оригинальное имя файла
    fileName: varchar("file_name", { length: 255 }),
    // Размер файла в байтах
    fileSize: varchar("file_size", { length: 20 }),
    // MIME тип
    mimeType: varchar("mime_type", { length: 100 }),
    // Временные метки
    uploadedAt: timestamp("uploaded_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("claim_document_claim_idx").on(table.claimId)]
);

// Связи
export const propertyClaimsRelations = relations(propertyClaims, ({ one, many }) => ({
  user: one(users, {
    fields: [propertyClaims.userId],
    references: [users.id],
  }),
  apartment: one(apartments, {
    fields: [propertyClaims.apartmentId],
    references: [apartments.id],
  }),
  parkingSpot: one(parkingSpots, {
    fields: [propertyClaims.parkingSpotId],
    references: [parkingSpots.id],
  }),
  organization: one(organizations, {
    fields: [propertyClaims.organizationId],
    references: [organizations.id],
  }),
  reviewer: one(users, {
    fields: [propertyClaims.reviewedBy],
    references: [users.id],
    relationName: "claimReviewer",
  }),
  documents: many(claimDocuments),
  history: many(claimHistory),
}));

export const claimHistoryRelations = relations(claimHistory, ({ one }) => ({
  claim: one(propertyClaims, {
    fields: [claimHistory.claimId],
    references: [propertyClaims.id],
  }),
  changedByUser: one(users, {
    fields: [claimHistory.changedBy],
    references: [users.id],
  }),
}));

export const claimDocumentsRelations = relations(claimDocuments, ({ one }) => ({
  claim: one(propertyClaims, {
    fields: [claimDocuments.claimId],
    references: [propertyClaims.id],
  }),
}));
