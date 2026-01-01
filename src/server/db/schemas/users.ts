import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

import { createTable } from "./create-table";

// Определяем enum ролей
export const userRoleEnum = pgEnum("user_role_enum", [
  "Root",
  "SuperAdmin",
  "Admin",
  "ApartmentOwner",
  "ApartmentResident",
  "ParkingOwner",
  "ParkingResident",
  "Editor",
  "Moderator",
  "Guest",
  "BuildingChairman",
  "ComplexChairman",
  "ComplexRepresenative",
  "StoreOwner",
  "StoreRepresenative",
]);

export const userGenderEnum = pgEnum("user_gender_enum", [
  "Male",
  "Female",
  "Unspecified",
]);

export const mapProviderEnum = pgEnum("map_provider_enum", [
  "yandex",
  "2gis",
  "google",
  "apple",
  "osm",
]);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  // Password for email/password auth (bcrypt hash)
  passwordHash: varchar("password_hash", { length: 255 }),
  // Registration date
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  // Soft delete fields
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", {
    mode: "date",
    withTimezone: true,
  }),
});

// Таблица ролей пользователей (many-to-many)
export const userRoles = createTable(
  "user_role",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.role] })],
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  roles: many(userRoles),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    index("account_user_id_idx").on(account.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => [index("session_user_id_idx").on(session.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// Токены для сброса пароля
export const passwordResetTokens = createTable(
  "password_reset_token",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    usedAt: timestamp("used_at", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("password_reset_token_idx").on(table.token)],
);

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  }),
);

// Токены для подтверждения email при регистрации
export const emailVerificationTokens = createTable(
  "email_verification_token",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    usedAt: timestamp("used_at", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("email_verification_token_idx").on(table.token)],
);

export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.userId],
      references: [users.id],
    }),
  }),
);

export const userProfiles = createTable("user_profile", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  middleName: varchar("middle_name", { length: 255 }),
  displayName: varchar("display_name", { length: 255 }),
  // Подпись профиля (роль/профессия/должность)
  // Если не задана - автоматически генерируется из ролей пользователя
  // Может быть назначена администратором (например для представителей УК)
  tagline: varchar("tagline", { length: 100 }),
  // Кастомная подпись установлена администратором (не может быть изменена пользователем)
  taglineSetByAdmin: boolean("tagline_set_by_admin").notNull().default(false),
  phone: varchar("phone", { length: 20 }), // E.164 format: +7XXXXXXXXXX (max 20 chars)
  hidePhone: boolean("hide_phone").notNull().default(false),
  hideName: boolean("hide_name").notNull().default(false),
  hideGender: boolean("hide_gender").notNull().default(false),
  hideBirthday: boolean("hide_birthday").notNull().default(false),
  avatar: varchar("avatar", { length: 255 }),
  dateOfBirth: timestamp("date_of_birth", {
    mode: "date",
  }),
  gender: userGenderEnum("gender"),
  // Мессенджеры
  telegramUsername: varchar("telegram_username", { length: 100 }), // @username без @
  telegramId: varchar("telegram_id", { length: 50 }), // ID пользователя для привязки через бота
  telegramVerified: boolean("telegram_verified").notNull().default(false), // Подтверждён ли через бота
  telegramVerifiedAt: timestamp("telegram_verified_at", { mode: "date", withTimezone: true }),
  maxUsername: varchar("max_username", { length: 100 }), // Max (VK Мессенджер)
  whatsappPhone: varchar("whatsapp_phone", { length: 20 }), // WhatsApp номер в E.164
  hideMessengers: boolean("hide_messengers").notNull().default(false), // Скрыть все мессенджеры
  // Настройки приложения
  mapProvider: mapProviderEnum("map_provider").default("yandex"), // Провайдер карт для адресов
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

// Токены для авторизации через Telegram бота
export const telegramAuthTokens = createTable(
  "telegram_auth_token",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Код который пользователь вводит в боте (6 цифр)
    code: varchar("code", { length: 6 }).notNull(),
    // Telegram ID пользователя (заполняется после ввода кода в боте)
    telegramId: varchar("telegram_id", { length: 50 }),
    telegramUsername: varchar("telegram_username", { length: 100 }),
    telegramFirstName: varchar("telegram_first_name", { length: 255 }),
    telegramLastName: varchar("telegram_last_name", { length: 255 }),
    // Статус токена
    verified: boolean("verified").notNull().default(false),
    verifiedAt: timestamp("verified_at", { mode: "date", withTimezone: true }),
    // Срок действия (15 минут)
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    // Использован ли токен для создания сессии
    usedAt: timestamp("used_at", { mode: "date", withTimezone: true }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("telegram_auth_token_code_idx").on(table.code),
    index("telegram_auth_token_telegram_id_idx").on(table.telegramId),
  ]
);

// Enum для категорий блокировки
export const blockCategoryEnum = pgEnum("block_category_enum", [
  "rules_violation",    // Нарушение правил сообщества
  "fraud",              // Мошенничество
  "spam",               // Спам
  "abuse",              // Оскорбления/травля
  "other",              // Другая причина
]);

// Пункты правил для нарушений
export const rulesViolationEnum = pgEnum("rules_violation_enum", [
  "3.1", // Запрещённый контент
  "3.2", // Недостоверная информация
  "3.3", // Нарушение приватности
  "3.4", // Коммерческая реклама
  "3.5", // Оскорбления и агрессия
  "4.1", // Фиктивные объявления
  "4.2", // Завышение/занижение цен
  "4.3", // Скрытые условия
  "5.1", // Множественные аккаунты
  "5.2", // Обход блокировки
]);

// Таблица блокировок пользователей
export const userBlocks = createTable(
  "user_block",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Кто заблокировал
    blockedBy: varchar("blocked_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    // Категория блокировки
    category: blockCategoryEnum("category").notNull(),
    // Нарушенные пункты правил (для rules_violation)
    violatedRules: text("violated_rules"), // JSON array of rule codes
    // Причина блокировки (для категории "other" или дополнительный комментарий)
    reason: text("reason"),
    // Активна ли блокировка
    isActive: boolean("is_active").notNull().default(true),
    // Дата создания
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    // Дата снятия блокировки
    unblockedAt: timestamp("unblocked_at", {
      mode: "date",
      withTimezone: true,
    }),
    // Кто снял блокировку
    unblockedBy: varchar("unblocked_by", { length: 255 })
      .references(() => users.id),
    // Причина снятия блокировки
    unblockReason: text("unblock_reason"),
  },
  (table) => [
    index("user_block_user_id_idx").on(table.userId),
    index("user_block_is_active_idx").on(table.isActive),
  ]
);

export const userBlocksRelations = relations(userBlocks, ({ one }) => ({
  user: one(users, { fields: [userBlocks.userId], references: [users.id] }),
  blockedByUser: one(users, {
    fields: [userBlocks.blockedBy],
    references: [users.id],
    relationName: "blockedByUser",
  }),
  unblockedByUser: one(users, {
    fields: [userBlocks.unblockedBy],
    references: [users.id],
    relationName: "unblockedByUser",
  }),
}));

// ============================================================================
// User Interest Buildings (область интересов - строения)
// ============================================================================

// Forward declaration for buildings reference
import { buildings } from "./buildings";

export const userInterestBuildings = createTable(
  "user_interest_building",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    buildingId: varchar("building_id", { length: 255 })
      .notNull()
      .references(() => buildings.id, { onDelete: "cascade" }),
    // Автоматически добавлено при регистрации собственности
    autoAdded: boolean("auto_added").notNull().default(false),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.buildingId] }),
    index("user_interest_building_user_idx").on(table.userId),
    index("user_interest_building_building_idx").on(table.buildingId),
  ]
);

export const userInterestBuildingsRelations = relations(
  userInterestBuildings,
  ({ one }) => ({
    user: one(users, {
      fields: [userInterestBuildings.userId],
      references: [users.id],
    }),
    building: one(buildings, {
      fields: [userInterestBuildings.buildingId],
      references: [buildings.id],
    }),
  })
);
