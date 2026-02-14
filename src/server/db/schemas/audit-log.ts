import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgEnum, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users } from "./users";

// ============================================================================
// Enums
// ============================================================================

// Типы сущностей для логирования
export const auditEntityTypeEnum = pgEnum("audit_entity_type_enum", [
  // Пользователи
  "user",
  "user_role",
  "user_block",
  // Заявки
  "deletion_request",
  "property_claim",
  // Контент
  "listing",
  "news",
  "publication",
  "feedback",
  // Справочники
  "directory_category",
  "directory_item",
  "directory_tag",
  // Здания и структура
  "building",
  "apartment",
  "parking",
  // Настройки
  "settings",
]);

// Действия для логирования
export const auditActionEnum = pgEnum("audit_action_enum", [
  // === Пользователи ===
  "user_created",
  "user_updated",
  "user_deleted",
  "user_restored",
  "user_password_changed",
  "user_password_reset_requested",
  "user_email_verified",
  "user_profile_updated",

  // === Роли ===
  "role_granted",
  "role_revoked",

  // === Блокировки ===
  "user_blocked",
  "user_unblocked",

  // === Запросы на удаление ===
  "deletion_requested",
  "deletion_approved",
  "deletion_rejected",
  "deletion_completed",

  // === Заявки на собственность ===
  "claim_created",
  "claim_status_changed",
  "claim_approved",
  "claim_rejected",
  "claim_documents_requested",

  // === Объявления (listings) ===
  "listing_created",
  "listing_updated",
  "listing_submitted",
  "listing_approved",
  "listing_rejected",
  "listing_archived",
  "listing_renewed",
  "listing_deleted",

  // === Публикации ===
  "publication_created",
  "publication_updated",
  "publication_submitted",
  "publication_approved",
  "publication_rejected",
  "publication_archived",
  "publication_published",
  "publication_pinned",
  "publication_unpinned",
  "publication_moderation_vote",
  "publication_deleted",

  // === Новости ===
  "news_created",
  "news_updated",
  "news_published",
  "news_scheduled",
  "news_archived",
  "news_deleted",
  "news_telegram_sent",

  // === Обратная связь ===
  "feedback_created",
  "feedback_status_changed",
  "feedback_priority_changed",
  "feedback_assigned",
  "feedback_forwarded",
  "feedback_responded",
  "feedback_closed",
  "feedback_reopened",

  // === Справочники ===
  "directory_item_created",
  "directory_item_updated",
  "directory_item_deleted",
  "directory_category_created",
  "directory_category_updated",
  "directory_category_deleted",

  // === Здания ===
  "building_created",
  "building_updated",
  "apartment_created",
  "apartment_updated",
  "parking_created",
  "parking_updated",

  // === Настройки ===
  "settings_updated",

  // === Общие ===
  "entity_viewed",
  "entity_exported",
]);

// ============================================================================
// Audit Log Table
// ============================================================================

export const auditLogs = createTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Какая сущность затронута
    entityType: auditEntityTypeEnum("entity_type").notNull(),
    entityId: varchar("entity_id", { length: 255 }).notNull(),

    // Какое действие выполнено
    action: auditActionEnum("action").notNull(),

    // Кто выполнил действие (null для системных действий)
    actorId: varchar("actor_id", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),

    // Предыдущее состояние (для обновлений)
    previousState: jsonb("previous_state").$type<Record<string, unknown>>(),

    // Новое состояние (для создания/обновления)
    newState: jsonb("new_state").$type<Record<string, unknown>>(),

    // Только изменённые поля (для эффективности)
    changedFields: jsonb("changed_fields").$type<string[]>(),

    // Человекочитаемое описание на русском
    // Пример: "Пользователь заблокирован за нарушение правил 3.1"
    description: text("description").notNull(),

    // Дополнительные метаданные (причины, комментарии и т.д.)
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    // IP адрес для событий безопасности
    ipAddress: varchar("ip_address", { length: 45 }),

    // User Agent для событий безопасности
    userAgent: text("user_agent"),

    // Время создания
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    // Основные индексы для админ-запросов
    index("audit_log_entity_idx").on(table.entityType, table.entityId),
    index("audit_log_action_idx").on(table.action),
    index("audit_log_actor_idx").on(table.actorId),
    index("audit_log_created_at_idx").on(table.createdAt),
    // Составной индекс для "показать все действия с этой сущностью"
    index("audit_log_entity_created_idx").on(table.entityType, table.entityId, table.createdAt),
  ]
);

// ============================================================================
// Relations
// ============================================================================

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
    relationName: "auditLogActor",
  }),
}));

// ============================================================================
// Types
// ============================================================================

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditEntityType = (typeof auditEntityTypeEnum.enumValues)[number];
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

// ============================================================================
// Helper Type for Creating Audit Logs
// ============================================================================

export type CreateAuditLogInput = {
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  actorId?: string | null;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  changedFields?: string[];
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

// ============================================================================
// Russian Action Descriptions
// ============================================================================

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  // Пользователи
  user_created: "Пользователь создан",
  user_updated: "Данные пользователя обновлены",
  user_deleted: "Пользователь удалён",
  user_restored: "Пользователь восстановлен",
  user_password_changed: "Пароль изменён",
  user_password_reset_requested: "Запрос на сброс пароля",
  user_email_verified: "Email подтверждён",
  user_profile_updated: "Профиль обновлён",

  // Роли
  role_granted: "Роль выдана",
  role_revoked: "Роль отозвана",

  // Блокировки
  user_blocked: "Пользователь заблокирован",
  user_unblocked: "Блокировка снята",

  // Удаление
  deletion_requested: "Запрос на удаление аккаунта",
  deletion_approved: "Запрос на удаление одобрен",
  deletion_rejected: "Запрос на удаление отклонён",
  deletion_completed: "Удаление аккаунта завершено",

  // Заявки
  claim_created: "Заявка создана",
  claim_status_changed: "Статус заявки изменён",
  claim_approved: "Заявка одобрена",
  claim_rejected: "Заявка отклонена",
  claim_documents_requested: "Запрошены документы",

  // Объявления
  listing_created: "Объявление создано",
  listing_updated: "Объявление обновлено",
  listing_submitted: "Объявление отправлено на модерацию",
  listing_approved: "Объявление одобрено",
  listing_rejected: "Объявление отклонено",
  listing_archived: "Объявление архивировано",
  listing_renewed: "Объявление продлено",
  listing_deleted: "Объявление удалено",

  // Публикации
  publication_created: "Публикация создана",
  publication_updated: "Публикация обновлена",
  publication_submitted: "Публикация отправлена на модерацию",
  publication_approved: "Публикация одобрена",
  publication_rejected: "Публикация отклонена",
  publication_archived: "Публикация архивирована",
  publication_published: "Публикация опубликована",
  publication_pinned: "Публикация закреплена",
  publication_unpinned: "Публикация откреплена",
  publication_moderation_vote: "Голос модератора",
  publication_deleted: "Публикация удалена",

  // Новости
  news_created: "Новость создана",
  news_updated: "Новость обновлена",
  news_published: "Новость опубликована",
  news_scheduled: "Новость запланирована",
  news_archived: "Новость архивирована",
  news_deleted: "Новость удалена",
  news_telegram_sent: "Отправлено в Telegram",

  // Обратная связь
  feedback_created: "Обращение создано",
  feedback_status_changed: "Статус обращения изменён",
  feedback_priority_changed: "Приоритет обращения изменён",
  feedback_assigned: "Обращение назначено",
  feedback_forwarded: "Обращение перенаправлено",
  feedback_responded: "Дан ответ на обращение",
  feedback_closed: "Обращение закрыто",
  feedback_reopened: "Обращение переоткрыто",

  // Справочники
  directory_item_created: "Элемент справочника создан",
  directory_item_updated: "Элемент справочника обновлён",
  directory_item_deleted: "Элемент справочника удалён",
  directory_category_created: "Категория справочника создана",
  directory_category_updated: "Категория справочника обновлена",
  directory_category_deleted: "Категория справочника удалена",

  // Здания
  building_created: "Строение создано",
  building_updated: "Строение обновлено",
  apartment_created: "Квартира создана",
  apartment_updated: "Квартира обновлена",
  parking_created: "Парковка создана",
  parking_updated: "Парковка обновлена",

  // Настройки
  settings_updated: "Настройки обновлены",

  // Общие
  entity_viewed: "Просмотр записи",
  entity_exported: "Экспорт данных",
};

export const AUDIT_ENTITY_LABELS: Record<AuditEntityType, string> = {
  user: "Пользователь",
  user_role: "Роль пользователя",
  user_block: "Блокировка",
  deletion_request: "Запрос на удаление",
  property_claim: "Заявка на собственность",
  listing: "Объявление",
  news: "Новость",
  publication: "Публикация",
  feedback: "Обратная связь",
  directory_category: "Категория справочника",
  directory_item: "Элемент справочника",
  directory_tag: "Тег",
  building: "Строение",
  apartment: "Квартира",
  parking: "Парковка",
  settings: "Настройки",
};
