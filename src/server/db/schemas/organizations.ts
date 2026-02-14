import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, primaryKey, text, varchar } from "drizzle-orm/pg-core";

import { buildings } from "./buildings";
import { createTable } from "./create-table";

// Перечисление типов магазинов
export const organizationTypeEnum = pgEnum("organization_type", [
  "store", // Магазин
  "restaurant", // Кафе, ресторан
  "service", // Услуги (салон красоты, почта и т.д.)
  "other", // Другое
]);

// Таблица организаций (магазины, кафе, сервисы)
export const organizations = createTable("organization", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  buildingId: varchar("building_id", { length: 255 })
    .notNull()
    .references(() => buildings.id, { onDelete: "cascade" }),
  floorNumber: integer("floor_number").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // Наименование
  description: text("description"), // Описание
  logo: varchar("logo", { length: 255 }), // URL логотипа
  schedule: jsonb("schedule").notNull(), // График работы в формате JSON
  type: organizationTypeEnum("type").notNull(), // Тип магазина
});

// Таблица тегов (сфера деятельности)
export const organizationTags = createTable("organization_tag", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull().unique(), // Название тега (например, "кофе", "одежда")
});

// Таблица связи организаций и тегов (многие ко многим)
export const organizationToTags = createTable(
  "organization_to_tag",
  {
    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => organizationTags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.organizationId, table.tagId] }),
  })
);

// Определяем связи
export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  building: one(buildings, {
    fields: [organizations.buildingId],
    references: [buildings.id],
  }),
  tags: many(organizationToTags),
}));

export const organizationToTagsRelations = relations(organizationToTags, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationToTags.organizationId],
    references: [organizations.id],
  }),
  tag: one(organizationTags, {
    fields: [organizationToTags.tagId],
    references: [organizationTags.id],
  }),
}));
