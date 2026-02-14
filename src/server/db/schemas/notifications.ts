import { relations, sql } from "drizzle-orm";
import { boolean, index, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users } from "./users";

// Типы уведомлений
export const notificationTypeEnum = pgEnum("notification_type_enum", [
  "claim_submitted", // Заявка подана
  "claim_approved", // Заявка одобрена
  "claim_rejected", // Заявка отклонена
  "claim_cancelled", // Заявка отменена
  "claim_documents", // Запрос документов
  "tenant_claim", // Заявка жильца на вашу собственность
  "property_revoked", // Права отозваны
  "message", // Сообщение от пользователя
  "system", // Системное уведомление
  "admin", // Уведомление от админа
]);

// Категории для группировки в UI
export const notificationCategoryEnum = pgEnum("notification_category_enum", [
  "claims", // Заявки и права
  "messages", // Сообщения
  "system", // Системные
]);

export const notifications = createTable(
  "notification",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // Получатель уведомления
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Отправитель (null для системных уведомлений)
    fromUserId: varchar("from_user_id", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),

    // Тип и категория
    type: notificationTypeEnum("type").notNull(),
    category: notificationCategoryEnum("category").notNull(),

    // Контент
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),

    // Ссылка на связанную сущность (claim, property, etc.)
    entityType: varchar("entity_type", { length: 50 }), // "claim", "apartment", "parking", etc.
    entityId: varchar("entity_id", { length: 255 }),

    // URL для перехода при клике
    actionUrl: varchar("action_url", { length: 500 }),

    // Статус
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at", { mode: "date", withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("notification_user_id_idx").on(table.userId),
    index("notification_user_unread_idx").on(table.userId, table.isRead),
    index("notification_created_at_idx").on(table.createdAt),
    index("notification_entity_idx").on(table.entityType, table.entityId),
  ]
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "notificationRecipient",
  }),
  fromUser: one(users, {
    fields: [notifications.fromUserId],
    references: [users.id],
    relationName: "notificationSender",
  }),
}));
