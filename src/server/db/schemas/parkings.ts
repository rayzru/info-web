import { relations } from "drizzle-orm";
import { pgEnum, smallint, varchar } from "drizzle-orm/pg-core";

import { buildings } from "./buildings";
import { createTable } from "./create-table";

// Enum для типов паркомест
export const parkingSpotTypeEnum = pgEnum("parking_spot_type", [
  "moto",
  "standard",
  "wide",
]);

// Таблица парковок (у здания может быть одна подземная парковка)
export const parkings = createTable("parking", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  buildingId: varchar("building_id", { length: 255 })
    .notNull()
    .references(() => buildings.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(), // Например, "Подземная парковка 1"
});

// Таблица этажей парковок
export const parkingFloors = createTable("parking_floor", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parkingId: varchar("parking_id", { length: 255 })
    .notNull()
    .references(() => parkings.id, { onDelete: "cascade" }),
  floorNumber: smallint("floor_number").notNull(), // -1, -2 и т.д.
});

// Таблица паркомест
export const parkingSpots = createTable("parking_spot", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  floorId: varchar("floor_id", { length: 255 })
    .notNull()
    .references(() => parkingFloors.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 10 }).notNull(), // Номер паркоместа
  type: parkingSpotTypeEnum("type").notNull(), // Тип паркоместа
});
// TODO: добавить таблицу связи зависимых паркомест  (которые стеком).

// Определяем связи
export const parkingsRelations = relations(parkings, ({ one, many }) => ({
  building: one(buildings, {
    fields: [parkings.buildingId],
    references: [buildings.id],
  }),
  floors: many(parkingFloors),
}));

export const parkingFloorsRelations = relations(
  parkingFloors,
  ({ one, many }) => ({
    parking: one(parkings, {
      fields: [parkingFloors.parkingId],
      references: [parkings.id],
    }),
    spots: many(parkingSpots),
  })
);

export const parkingSpotsRelations = relations(parkingSpots, ({ one }) => ({
  floor: one(parkingFloors, {
    fields: [parkingSpots.floorId],
    references: [parkingFloors.id],
  }),
}));
