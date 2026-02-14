import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  notificationCategoryEnum,
  notifications,
  type notificationTypeEnum,
  users,
} from "~/server/db/schema";

export const notificationsRouter = createTRPCRouter({
  // Получить список уведомлений пользователя
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // для пагинации
        unreadOnly: z.boolean().default(false),
        category: z.enum(notificationCategoryEnum.enumValues).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const conditions = [eq(notifications.userId, userId)];

      if (input.unreadOnly) {
        conditions.push(eq(notifications.isRead, false));
      }

      if (input.category) {
        conditions.push(eq(notifications.category, input.category));
      }

      const items = await ctx.db.query.notifications.findMany({
        where: and(...conditions),
        orderBy: [desc(notifications.createdAt)],
        limit: input.limit + 1, // +1 для определения наличия следующей страницы
        with: {
          fromUser: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Получить количество непрочитанных уведомлений
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const result = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return result[0]?.count ?? 0;
  }),

  // Отметить уведомление как прочитанное
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const notification = await ctx.db.query.notifications.findFirst({
        where: and(eq(notifications.id, input.id), eq(notifications.userId, userId)),
      });

      if (!notification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Уведомление не найдено",
        });
      }

      await ctx.db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Отметить все уведомления как прочитанные
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return { success: true };
  }),

  // Удалить уведомление
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const notification = await ctx.db.query.notifications.findFirst({
        where: and(eq(notifications.id, input.id), eq(notifications.userId, userId)),
      });

      if (!notification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Уведомление не найдено",
        });
      }

      await ctx.db.delete(notifications).where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Удалить все прочитанные уведомления
  deleteAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db
      .delete(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, true)));

    return { success: true };
  }),
});

// Вспомогательная функция для создания уведомлений (используется в других роутерах)
export async function createNotification(
  db: typeof import("~/server/db").db,
  data: {
    userId: string;
    fromUserId?: string;
    type: (typeof notificationTypeEnum.enumValues)[number];
    category: (typeof notificationCategoryEnum.enumValues)[number];
    title: string;
    message?: string;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
  }
) {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId: data.userId,
      fromUserId: data.fromUserId,
      type: data.type,
      category: data.category,
      title: data.title,
      message: data.message,
      entityType: data.entityType,
      entityId: data.entityId,
      actionUrl: data.actionUrl,
    })
    .returning();

  return notification;
}
