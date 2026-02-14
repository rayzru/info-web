import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  smallint,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { parkings } from "./parkings";

// Enum для типов каналов коммуникации
export const channelTypeEnum = pgEnum("channel_type", [
  "telegram",
  "max", // Будущий MAX
  "whatsapp",
  "vk",
  "email",
  "other",
]);

// Enum для типов квартир
export const apartmentTypeEnum = pgEnum("apartment_type", ["studio", "1k", "2k", "3k", "4k"]);

// Таблица строений
export const buildings = createTable("building", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  number: smallint("number").unique(), // Номер (если есть)
  title: varchar("title", { length: 255 }).unique(), // Название
  liter: varchar("liter", { length: 255 }), // Литер (если есть)
  active: boolean("active"),
});

// Таблица подъездов
export const entrances = createTable(
  "entrance",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    buildingId: varchar("building_id", { length: 255 })
      .notNull()
      .references(() => buildings.id, { onDelete: "cascade" }),
    entranceNumber: smallint("entrance_number").notNull(), // Номер подъезда
  },
  (entrance) => [
    unique("building_id_entrance_number_idx").on(entrance.buildingId, entrance.entranceNumber),
  ]
);

// Таблица этажей
export const floors = createTable(
  "floor",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    entranceId: varchar("entrance_id", { length: 255 })
      .notNull()
      .references(() => entrances.id, { onDelete: "cascade" }),
    floorNumber: smallint("floor_number").notNull(), // Номер этажа
  },
  (floor) => [unique("endtance_id_floor_number_idx").on(floor.floorNumber, floor.entranceId)]
);

// Таблица квартир
export const apartments = createTable("apartment", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  floorId: varchar("floor_id", { length: 255 })
    .notNull()
    .references(() => floors.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 10 }).notNull(), // Номер квартиры
  type: apartmentTypeEnum("type").notNull(), // Тип квартиры
  layoutCode: varchar("layout_code", { length: 255 }), // Код планировки
});

// ============== BUILDING CHANNELS ==============
// Системные каналы коммуникации для зданий (для уведомлений, рассылок)

export const buildingChannels = createTable(
  "building_channel",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Привязка к зданию (опционально - может быть общий канал ЖК)
    buildingId: varchar("building_id", { length: 255 }).references(() => buildings.id, {
      onDelete: "cascade",
    }),
    // Тип канала
    channelType: channelTypeEnum("channel_type").notNull(),
    // ID/ссылка канала (chat_id для Telegram, URL для других)
    channelId: varchar("channel_id", { length: 500 }).notNull(),
    // Название канала для отображения
    name: varchar("name", { length: 255 }),
    // Флаги
    isActive: integer("is_active").notNull().default(1), // Активен для уведомлений
    isPrimary: integer("is_primary").notNull().default(0), // Основной канал
    // Метаданные
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("building_channel_building_idx").on(table.buildingId),
    index("building_channel_type_idx").on(table.channelType),
    index("building_channel_active_idx").on(table.isActive),
  ]
);

// Определяем связи
export const buildingsRelations = relations(buildings, ({ many }) => ({
  entrances: many(entrances),
  parkings: many(parkings),
  channels: many(buildingChannels),
}));

export const entrancesRelations = relations(entrances, ({ one, many }) => ({
  building: one(buildings, {
    fields: [entrances.buildingId],
    references: [buildings.id],
  }),
  floors: many(floors),
}));

export const floorsRelations = relations(floors, ({ one, many }) => ({
  entrance: one(entrances, {
    fields: [floors.entranceId],
    references: [entrances.id],
  }),
  apartments: many(apartments),
}));

export const apartmentsRelations = relations(apartments, ({ one }) => ({
  floor: one(floors, { fields: [apartments.floorId], references: [floors.id] }),
}));

export const buildingChannelsRelations = relations(buildingChannels, ({ one }) => ({
  building: one(buildings, {
    fields: [buildingChannels.buildingId],
    references: [buildings.id],
  }),
}));
