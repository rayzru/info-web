import { boolean, index, pgEnum, smallint, unique, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import { relations } from "drizzle-orm";

// Enum для типов квартир
export const apartmentTypeEnum = pgEnum("apartment_type", [
  "studio",
  "1k",
  "2k",
  "3k",
]);

// Таблица строений
export const buildings = createTable("building", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: smallint("number").unique(), // Номер (если есть)
  title: varchar("title", { length: 255 }).unique(), // Название
  liter: varchar("liter", { length: 255 }), // Литер (если есть)
  active: boolean("active")
});

// Таблица подъездов
export const entrances = createTable("entrance", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  buildingId: varchar("building_id", { length: 255 }).notNull().references(() => buildings.id, { onDelete: "cascade" }),
  entranceNumber: smallint("entrance_number").notNull(), // Номер подъезда
}, (entrance) => ([
  unique("building_id_entrance_number_idx").on(entrance.buildingId, entrance.entranceNumber),
]));

// Таблица этажей
export const floors = createTable("floor", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  entranceId: varchar("entrance_id", { length: 255 }).notNull().references(() => entrances.id, { onDelete: "cascade" }),
  floorNumber: smallint("floor_number").notNull(), // Номер этажа
}, (floor) => ([
  unique("endtance_id_floor_number_idx").on(floor.floorNumber, floor.entranceId),
]));

// Таблица квартир
export const apartments = createTable("apartment", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  floorId: varchar("floor_id", { length: 255 }).notNull().references(() => floors.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 10 }).notNull(), // Номер квартиры
  type: apartmentTypeEnum("type").notNull(), // Тип квартиры
  layoutCode: varchar("layout_code", { length: 255 }), // Код планировки
}, );

// Определяем связи
export const buildingsRelations = relations(buildings, ({ many }) => ({
  entrances: many(entrances),
}));

export const entrancesRelations = relations(entrances, ({ one, many }) => ({
  building: one(buildings, { fields: [entrances.buildingId], references: [buildings.id] }),
  floors: many(floors),
}));

export const floorsRelations = relations(floors, ({ one, many }) => ({
  entrance: one(entrances, { fields: [floors.entranceId], references: [entrances.id] }),
  apartments: many(apartments),
}));

export const apartmentsRelations = relations(apartments, ({ one }) => ({
  floor: one(floors, { fields: [apartments.floorId], references: [floors.id] }),
}));
