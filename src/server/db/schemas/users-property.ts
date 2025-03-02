import { relations } from "drizzle-orm";
import { varchar, pgEnum, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users, userRoleEnum } from "./users";
import { apartments } from "./buildings";
import { parkingSpots } from "./parkings";

// Статусы связи пользователя с объектом недвижимости
export const userPropertyStatusEnum = pgEnum("user_property_status", [
  "pending",
  "approved",
  "rejected",
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
  },
  (table) => [primaryKey({ columns: [table.userId, table.apartmentId] })]
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
  },
  (table) => [primaryKey({ columns: [table.userId, table.parkingSpotId] })]
);

// Определяем связи
export const userApartmentsRelations = relations(userApartments, ({ one }) => ({
  user: one(users, { fields: [userApartments.userId], references: [users.id] }),
  apartment: one(apartments, {
    fields: [userApartments.apartmentId],
    references: [apartments.id],
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
  })
);
