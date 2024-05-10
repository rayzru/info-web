import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, primaryKey, serial, smallint, text, timestamp, unique, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters'


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  verifiedAt: timestamp('verified_at', { mode: 'date' }),
}, (user) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(user.email),
  };
});

export const usersToRoles = pgTable('users_roles', {
  roleId: varchar('role_id').notNull().references(() => roles.id),
  userId: serial('user_id').notNull().references(() => users.id),
}, (t) => ({
  userRoleIdx: unique().on(t.userId, t.roleId),
}));

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description')
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(usersToRoles),
}))

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  phones: many(phones),
  roles: many(usersToRoles)
}));

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const accounts = pgTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccount>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
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
  number: smallint('number').unique().notNull(),
  name: text('name'),
  address: text('address'),
});

export const entrances = pgTable('entrances', {
  id: serial('id').primaryKey(),
  number: smallint('number').notNull(),
  name: text('name'),
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

export const apartmentsOnUsers = pgTable('apartments_users', {
  apartmentId: serial('apartment_id').references(() => apartments.id),
  userId: serial('user_id').references(() => users.id),
});

export const parkingsOnUsers = pgTable('parkings_users', {
  parkingId: serial('parking_id').references(() => parking.id),
  userId: serial('user_id').references(() => users.id),
})

export const apartmentSchemas = pgTable('apartment_schemas', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  buildingId: serial('building_id').references(() => buildings.id),
});

export const parkingVariantEnum = pgEnum('variant', ['standart', 'moto', 'large']);
export const parkingLevelEnum = pgEnum('level', ['-1', '-2']);

export const parking = pgTable('parking', {
  id: serial('id').primaryKey(),
  variant: parkingVariantEnum('variant'),
  level: parkingLevelEnum('level'),
  parkingNumber: smallint('parking_number').notNull(),
  buildingId: serial('building_id').references(() => buildings.id),
}, (t) => ({
  unq: unique().on(t.buildingId, t.parkingNumber),
}));

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
