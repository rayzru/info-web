import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, serial, smallint, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('user_roles', [
  'guest', //default role
  'root', 'superadmin', 'admin',
  'editor', 'moderator',
  'building_chairman', // председатель
  'building_initiative', // совет дома/инициативный
  'owner',
  'resident',
  'service',
  'represenative', // ?
  'administrative', // представители УК
  'system'// боты/скрипты...
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: userRoles('role').notNull().default('guest'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}, (user) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(user.email),
  };
});

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  phones: many(phones),
}));

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  displayName: text('display_name'),
  name: text('name'),
  surname: text('surname'),
  middlename: text('middlename'),
  phones: serial('phones').references(() => phones.id),

  userId: serial('user_id').notNull().references(() => users.id),
});

export const phones = pgTable('phones', {
  id: serial('id').primaryKey(),
  label: text('label'),
  phone: text('name').unique().notNull(),
  userId: serial('user_id').references(() => users.id),
});

export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  number: smallint('number'),
  name: text('name'),
  address: text('address'),
});

export const entrances = pgTable('entrances', {
  id: serial('id').primaryKey(),
  number: smallint('number'),
  buildingId: serial('building_id').references(() => buildings.id),
});

export const floors = pgTable('entrances', {
  id: serial('id').primaryKey(),
  number: smallint('number').notNull(),
  name: text('name'),
  entranceId: serial('entrance_id').references(() => entrances.id),
  buildingId: serial('building_id').references(() => buildings.id),
});

export const apartments = pgTable('apartments', {
  id: serial('id').primaryKey(),
  number: smallint('number').notNull(),
  name: text('name'),
  floorId: serial('floor_id').references(() => floors.id),
  entranceId: serial('entrance_id').references(() => entrances.id),
  buildingId: serial('building_id').references(() => buildings.id),
  schemaId: serial('schema_id').references(() => apartmentSchemas.id),
});

export const apartmentSchemas = pgTable('apartment_schemas', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  buildingId: serial('building_id').references(() => buildings.id),
});

export const parkingVariantEnum = pgEnum('variant', ['standart', 'moto', 'large']);

export const parking = pgTable('parking', {
  id: serial('id').primaryKey(),
  variant: parkingVariantEnum('variant'),
  level: smallint('level'),
  parkingNumber: smallint('parking_number'),
  buildingId: serial('building_id').references(() => buildings.id),
});

export const parkingOffer = pgTable('parking_offer', {
  id: serial('id').primaryKey(),
  parkingId: serial('parking_id').references(() => parking.id),
  price: smallint('price'),
  userId: serial('user_id').references(() => users.id),
  phone: serial('phone_id').references(() => phones.id),
  confirmed: boolean('confirmed').default(false),
  visible: boolean('visible').default(false),
  showMessengers: boolean('show_messengers').default(false),
});
