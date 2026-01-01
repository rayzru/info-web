import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { apartments, buildings, entrances, floors } from "./buildings";
import { createTable } from "./create-table";
import { parkingFloors, parkings, parkingSpots } from "./parkings";
import { users } from "./users";

// ============== ENUMS ==============

// Область видимости сообщения
export const messageScopeEnum = pgEnum("message_scope", [
  // Жилые здания
  "complex",      // На весь ЖК (только УК и админы)
  "building",     // На конкретный корпус
  "entrance",     // На подъезд
  "floor",        // На этаж
  "apartment",    // Конкретная квартира (личное сообщение)
  // Паркинг
  "parking",      // На весь паркинг
  "parking_floor", // На этаж паркинга
  "parking_spot", // Конкретное паркоместо (личное сообщение)
  // Специальные
  "uk",           // Представителю УК
  "chairman",     // Председателю дома
]);

// Статус сообщения
export const messageStatusEnum = pgEnum("message_status", [
  "draft",        // Черновик
  "pending",      // На модерации (массовые рассылки)
  "sent",         // Отправлено
  "delivered",    // Доставлено
  "rejected",     // Отклонено модератором
]);

// Тип жалобы на сообщение
export const messageComplaintTypeEnum = pgEnum("message_complaint_type", [
  "spam",           // Спам
  "harassment",     // Оскорбления, травля
  "fraud",          // Мошенничество
  "inappropriate",  // Неприемлемый контент
  "other",          // Другое
]);

// Статус жалобы
export const messageComplaintStatusEnum = pgEnum("message_complaint_status", [
  "pending",    // На рассмотрении
  "reviewed",   // Рассмотрена
  "resolved",   // Решена (приняты меры)
  "dismissed",  // Отклонена
]);

// ============== MESSAGE THREAD ==============
// Группировка сообщений по диалогу/теме

export const messageThreads = createTable(
  "message_thread",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Тема диалога (опционально)
    subject: varchar("subject", { length: 255 }),
    // Создатель диалога
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Область диалога
    scope: messageScopeEnum("scope").notNull(),
    // Привязки к объектам (в зависимости от scope)
    buildingId: varchar("building_id", { length: 255 }).references(
      () => buildings.id,
      { onDelete: "cascade" }
    ),
    entranceId: varchar("entrance_id", { length: 255 }).references(
      () => entrances.id,
      { onDelete: "cascade" }
    ),
    floorId: varchar("floor_id", { length: 255 }).references(
      () => floors.id,
      { onDelete: "cascade" }
    ),
    apartmentId: varchar("apartment_id", { length: 255 }).references(
      () => apartments.id,
      { onDelete: "cascade" }
    ),
    parkingId: varchar("parking_id", { length: 255 }).references(
      () => parkings.id,
      { onDelete: "cascade" }
    ),
    parkingFloorId: varchar("parking_floor_id", { length: 255 }).references(
      () => parkingFloors.id,
      { onDelete: "cascade" }
    ),
    parkingSpotId: varchar("parking_spot_id", { length: 255 }).references(
      () => parkingSpots.id,
      { onDelete: "cascade" }
    ),
    // Для личных сообщений - второй участник
    recipientId: varchar("recipient_id", { length: 255 }).references(
      () => users.id,
      { onDelete: "cascade" }
    ),
    // Флаги
    isArchived: boolean("is_archived").notNull().default(false),
    isLocked: boolean("is_locked").notNull().default(false), // Закрыт для новых сообщений
    // Даты
    lastMessageAt: timestamp("last_message_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("message_thread_created_by_idx").on(table.createdBy),
    index("message_thread_scope_idx").on(table.scope),
    index("message_thread_building_idx").on(table.buildingId),
    index("message_thread_apartment_idx").on(table.apartmentId),
    index("message_thread_parking_spot_idx").on(table.parkingSpotId),
    index("message_thread_recipient_idx").on(table.recipientId),
    index("message_thread_last_message_idx").on(table.lastMessageAt),
  ]
);

// ============== MESSAGE ==============

export const messages = createTable(
  "message",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Привязка к диалогу
    threadId: varchar("thread_id", { length: 255 })
      .notNull()
      .references(() => messageThreads.id, { onDelete: "cascade" }),
    // Отправитель
    senderId: varchar("sender_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Содержимое (TipTap JSON или plain text)
    content: text("content").notNull(),
    isRichText: boolean("is_rich_text").notNull().default(false),
    // Статус
    status: messageStatusEnum("status").notNull().default("sent"),
    // Модерация (для массовых рассылок)
    moderatedBy: varchar("moderated_by", { length: 255 }).references(
      () => users.id,
      { onDelete: "set null" }
    ),
    moderatedAt: timestamp("moderated_at"),
    moderationComment: text("moderation_comment"),
    // Ответ на сообщение (цитирование)
    replyToId: varchar("reply_to_id", { length: 255 }),
    // Флаги
    isEdited: boolean("is_edited").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
    // Даты
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    editedAt: timestamp("edited_at"),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("message_thread_idx").on(table.threadId),
    index("message_sender_idx").on(table.senderId),
    index("message_status_idx").on(table.status),
    index("message_created_idx").on(table.createdAt),
    index("message_reply_idx").on(table.replyToId),
  ]
);

// ============== MESSAGE RECIPIENT ==============
// Для массовых рассылок - отслеживание доставки каждому получателю

export const messageRecipients = createTable(
  "message_recipient",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    messageId: varchar("message_id", { length: 255 })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    recipientId: varchar("recipient_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Статус доставки
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at"),
    // Флаги
    isArchived: boolean("is_archived").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false), // Удалено получателем
  },
  (table) => [
    index("message_recipient_message_idx").on(table.messageId),
    index("message_recipient_recipient_idx").on(table.recipientId),
    index("message_recipient_read_idx").on(table.isRead),
  ]
);

// ============== MESSAGE QUOTA ==============
// Квоты на рассылки для пользователей

export const messageQuotas = createTable(
  "message_quota",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    // Дневной лимит массовых сообщений
    dailyLimit: integer("daily_limit").notNull().default(5),
    dailyUsed: integer("daily_used").notNull().default(0),
    dailyResetAt: timestamp("daily_reset_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    // Недельный лимит
    weeklyLimit: integer("weekly_limit").notNull().default(20),
    weeklyUsed: integer("weekly_used").notNull().default(0),
    weeklyResetAt: timestamp("weekly_reset_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    // Флаг блокировки рассылок
    isBlocked: boolean("is_blocked").notNull().default(false),
    blockedReason: text("blocked_reason"),
    blockedAt: timestamp("blocked_at"),
    blockedBy: varchar("blocked_by", { length: 255 }).references(
      () => users.id,
      { onDelete: "set null" }
    ),
    // Даты
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("message_quota_user_idx").on(table.userId),
    index("message_quota_blocked_idx").on(table.isBlocked),
  ]
);

// ============== MESSAGE COMPLAINT ==============
// Жалобы на сообщения

export const messageComplaints = createTable(
  "message_complaint",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // На какое сообщение жалоба
    messageId: varchar("message_id", { length: 255 })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    // Кто пожаловался
    reporterId: varchar("reporter_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Тип жалобы
    complaintType: messageComplaintTypeEnum("complaint_type").notNull(),
    // Описание жалобы
    description: text("description"),
    // Статус обработки
    status: messageComplaintStatusEnum("status").notNull().default("pending"),
    // Модерация
    reviewedBy: varchar("reviewed_by", { length: 255 }).references(
      () => users.id,
      { onDelete: "set null" }
    ),
    reviewedAt: timestamp("reviewed_at"),
    reviewComment: text("review_comment"),
    // Принятые меры
    actionTaken: text("action_taken"), // JSON: { userWarned, userBlocked, messageDeleted, etc }
    // Даты
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("message_complaint_message_idx").on(table.messageId),
    index("message_complaint_reporter_idx").on(table.reporterId),
    index("message_complaint_status_idx").on(table.status),
    index("message_complaint_created_idx").on(table.createdAt),
  ]
);

// ============== MESSAGE ATTACHMENT ==============
// Вложения к сообщениям

export const messageAttachments = createTable(
  "message_attachment",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    messageId: varchar("message_id", { length: 255 })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    // Тип файла
    fileType: varchar("file_type", { length: 50 }).notNull(), // image, document, etc
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileUrl: varchar("file_url", { length: 500 }).notNull(),
    fileSize: integer("file_size"), // в байтах
    mimeType: varchar("mime_type", { length: 100 }),
    // Для изображений
    width: integer("width"),
    height: integer("height"),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    // Даты
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("message_attachment_message_idx").on(table.messageId),
  ]
);

// ============== RELATIONS ==============

export const messageThreadsRelations = relations(
  messageThreads,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [messageThreads.createdBy],
      references: [users.id],
      relationName: "threadCreator",
    }),
    recipient: one(users, {
      fields: [messageThreads.recipientId],
      references: [users.id],
      relationName: "threadRecipient",
    }),
    building: one(buildings, {
      fields: [messageThreads.buildingId],
      references: [buildings.id],
    }),
    entrance: one(entrances, {
      fields: [messageThreads.entranceId],
      references: [entrances.id],
    }),
    floor: one(floors, {
      fields: [messageThreads.floorId],
      references: [floors.id],
    }),
    apartment: one(apartments, {
      fields: [messageThreads.apartmentId],
      references: [apartments.id],
    }),
    parking: one(parkings, {
      fields: [messageThreads.parkingId],
      references: [parkings.id],
    }),
    parkingFloor: one(parkingFloors, {
      fields: [messageThreads.parkingFloorId],
      references: [parkingFloors.id],
    }),
    parkingSpot: one(parkingSpots, {
      fields: [messageThreads.parkingSpotId],
      references: [parkingSpots.id],
    }),
    messages: many(messages),
  })
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  thread: one(messageThreads, {
    fields: [messages.threadId],
    references: [messageThreads.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "messageSender",
  }),
  moderator: one(users, {
    fields: [messages.moderatedBy],
    references: [users.id],
    relationName: "messageModeratorBy",
  }),
  replyTo: one(messages, {
    fields: [messages.replyToId],
    references: [messages.id],
    relationName: "messageReplies",
  }),
  replies: many(messages, {
    relationName: "messageReplies",
  }),
  recipients: many(messageRecipients),
  attachments: many(messageAttachments),
  complaints: many(messageComplaints),
}));

export const messageRecipientsRelations = relations(
  messageRecipients,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageRecipients.messageId],
      references: [messages.id],
    }),
    recipient: one(users, {
      fields: [messageRecipients.recipientId],
      references: [users.id],
    }),
  })
);

export const messageQuotasRelations = relations(messageQuotas, ({ one }) => ({
  user: one(users, {
    fields: [messageQuotas.userId],
    references: [users.id],
  }),
  blockedByUser: one(users, {
    fields: [messageQuotas.blockedBy],
    references: [users.id],
    relationName: "quotaBlocker",
  }),
}));

export const messageComplaintsRelations = relations(
  messageComplaints,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageComplaints.messageId],
      references: [messages.id],
    }),
    reporter: one(users, {
      fields: [messageComplaints.reporterId],
      references: [users.id],
      relationName: "complaintReporter",
    }),
    reviewer: one(users, {
      fields: [messageComplaints.reviewedBy],
      references: [users.id],
      relationName: "complaintReviewer",
    }),
  })
);

export const messageAttachmentsRelations = relations(
  messageAttachments,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageAttachments.messageId],
      references: [messages.id],
    }),
  })
);
