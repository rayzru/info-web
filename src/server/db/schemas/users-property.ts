import { relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { apartments } from "./buildings";
import { createTable } from "./create-table";
import { parkingSpots } from "./parkings";
import { userRoleEnum, users } from "./users";

// Статусы связи пользователя с объектом недвижимости
export const userPropertyStatusEnum = pgEnum("user_property_status", [
  "pending",
  "approved",
  "rejected",
]);

// Шаблоны причин отзыва прав
export const revocationTemplateEnum = pgEnum("revocation_template", [
  "community_rules_violation", // Нарушение правил сообщества
  "role_owner_change", // Смена роли, смена владельца, изменение правового состояния
  "custom", // Самому заполнить
]);

// Таблица связи пользователей и квартир
export const userApartments = createTable(
  "user_apartment",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    apartmentId: varchar("apartment_id", { length: 255 })
      .notNull()
      .references(() => apartments.id, { onDelete: "cascade" }),
    status: userPropertyStatusEnum("status").notNull().default("pending"),
    role: userRoleEnum("role").notNull(),
    // Поля для soft-delete (отзыв прав)
    revokedAt: timestamp("revoked_at", { mode: "date", withTimezone: true }),
    revokedBy: varchar("revoked_by", { length: 255 }).references(
      () => users.id
    ),
    revocationTemplate: revocationTemplateEnum("revocation_template"),
    revocationReason: text("revocation_reason"),
    // Временные метки
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.apartmentId] }),
    index("user_apartment_revoked_idx").on(table.revokedAt),
  ]
);

// Таблица связи пользователей и паркомест
export const userParkingSpots = createTable(
  "user_parking_spot",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parkingSpotId: varchar("parking_spot_id", { length: 255 })
      .notNull()
      .references(() => parkingSpots.id, { onDelete: "cascade" }),
    status: userPropertyStatusEnum("status").notNull().default("pending"),
    role: userRoleEnum("role").notNull(),
    // Поля для soft-delete (отзыв прав)
    revokedAt: timestamp("revoked_at", { mode: "date", withTimezone: true }),
    revokedBy: varchar("revoked_by", { length: 255 }).references(
      () => users.id
    ),
    revocationTemplate: revocationTemplateEnum("revocation_template"),
    revocationReason: text("revocation_reason"),
    // Временные метки
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.parkingSpotId] }),
    index("user_parking_spot_revoked_idx").on(table.revokedAt),
  ]
);

// Определяем связи
export const userApartmentsRelations = relations(userApartments, ({ one }) => ({
  user: one(users, { fields: [userApartments.userId], references: [users.id] }),
  apartment: one(apartments, {
    fields: [userApartments.apartmentId],
    references: [apartments.id],
  }),
  revokedByUser: one(users, {
    fields: [userApartments.revokedBy],
    references: [users.id],
    relationName: "apartmentRevoker",
  }),
}));

export const userParkingSpotsRelations = relations(
  userParkingSpots,
  ({ one }) => ({
    user: one(users, {
      fields: [userParkingSpots.userId],
      references: [users.id],
    }),
    parkingSpot: one(parkingSpots, {
      fields: [userParkingSpots.parkingSpotId],
      references: [parkingSpots.id],
    }),
    revokedByUser: one(users, {
      fields: [userParkingSpots.revokedBy],
      references: [users.id],
      relationName: "parkingRevoker",
    }),
  })
);
