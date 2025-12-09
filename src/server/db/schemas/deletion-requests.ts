import { relations, sql } from "drizzle-orm";
import { index, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import { users } from "./users";

export const deletionRequestStatusEnum = pgEnum("deletion_request_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
]);

export const deletionRequests = createTable(
  "deletion_request",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: deletionRequestStatusEnum("status").notNull().default("pending"),
    reason: text("reason"),
    adminNotes: text("admin_notes"),
    processedBy: varchar("processed_by", { length: 255 }).references(
      () => users.id
    ),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    processedAt: timestamp("processed_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => [
    index("deletion_request_user_id_idx").on(table.userId),
    index("deletion_request_status_idx").on(table.status),
  ]
);

export const deletionRequestsRelations = relations(
  deletionRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [deletionRequests.userId],
      references: [users.id],
    }),
    processedByUser: one(users, {
      fields: [deletionRequests.processedBy],
      references: [users.id],
    }),
  })
);
