import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";

//================ СПРАВОЧНАЯ
//

// Группа контактов
export const contactGroups = createTable("contact_groups", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // Тип (ЖК, УК, ЖКХ и т. д.)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Группы свойств внутри ContactGroup
export const propertyGroups = createTable("property_groups", {
  id: varchar("id", { length: 36 }).primaryKey(),
  contactGroupId: varchar("contact_group_id", { length: 36 }).references(
    () => contactGroups.id,
    { onDelete: "cascade" }
  ),
  name: text("name").notNull(),
  order: integer("order").default(0),
});

// Свойства внутри группы
export const properties = createTable("properties", {
  id: varchar("id", { length: 36 }).primaryKey(),
  groupId: varchar("group_id", { length: 36 }).references(
    () => propertyGroups.id,
    { onDelete: "cascade" }
  ),
  key: text("key").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(), // STRING, PHONE, LINK и т. д.
  order: integer("order").default(0), // Порядок внутри группы
});

// Теги
export const tags = createTable("tags", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").unique().notNull(),
});

// Промежуточная таблица ContactGroup ↔ Tag
export const contactGroupTags = createTable(
  "contact_group_tags",
  {
    contactGroupId: varchar("contact_group_id", { length: 36 })
      .notNull()
      .references(() => contactGroups.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 36 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.contactGroupId, t.tagId] })]
);

// Relations
export const contactGroupRelations = relations(contactGroups, ({ many }) => ({
  propertyGroups: many(propertyGroups),
  tags: many(contactGroupTags),
}));

export const propertyGroupRelations = relations(propertyGroups, ({ many }) => ({
  properties: many(properties),
  contactGroup: many(contactGroups),
}));

export const propertyRelations = relations(properties, ({ one }) => ({
  group: one(propertyGroups, {
    fields: [properties.groupId],
    references: [propertyGroups.id],
  }),
}));

export const contactGroupTagRelations = relations(contactGroupTags, ({ one }) => ({
  contactGroup: one(contactGroups, {
    fields: [contactGroupTags.contactGroupId],
    references: [contactGroups.id],
  }),
  tag: one(tags, { fields: [contactGroupTags.tagId], references: [tags.id] }),
}));
