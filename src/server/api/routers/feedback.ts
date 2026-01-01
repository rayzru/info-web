import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { z } from "zod";

import {
  feedback,
  feedbackTypeEnum,
  feedbackStatusEnum,
  feedbackPriorityEnum,
  feedbackHistory,
  FEEDBACK_LIMITS,
  FEEDBACK_RATE_LIMIT,
  FEEDBACK_STATUS_LABELS,
  FEEDBACK_PRIORITY_LABELS,
} from "~/server/db/schema";
import {
  adminProcedureWithFeature,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

// ============================================================================
// Validation Schemas
// ============================================================================

const feedbackTypeSchema = z.enum(feedbackTypeEnum.enumValues);
const feedbackStatusSchema = z.enum(feedbackStatusEnum.enumValues);
const feedbackPrioritySchema = z.enum(feedbackPriorityEnum.enumValues);

const createFeedbackSchema = z.object({
  type: feedbackTypeSchema.default("suggestion"),
  title: z.string().max(FEEDBACK_LIMITS.MAX_TITLE_LENGTH).optional(),
  content: z
    .string()
    .min(10, "Текст обращения должен содержать минимум 10 символов")
    .max(FEEDBACK_LIMITS.MAX_CONTENT_LENGTH, `Максимум ${FEEDBACK_LIMITS.MAX_CONTENT_LENGTH} символов`),
  // Контактные данные
  contactName: z.string().max(255).optional(),
  contactEmail: z.string().email("Некорректный email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional(),
  // Вложения (могут быть относительными путями типа /uploads/...)
  attachments: z.array(z.string().min(1)).max(FEEDBACK_LIMITS.MAX_ATTACHMENTS).optional(),
  photos: z.array(z.string().min(1)).max(FEEDBACK_LIMITS.MAX_PHOTOS).optional(),
});

// ============================================================================
// Router
// ============================================================================

export const feedbackRouter = createTRPCRouter({
  // ==================== Public Procedures ====================

  /**
   * Submit new feedback (available to everyone, including guests)
   */
  submit: publicProcedure
    .input(createFeedbackSchema)
    .mutation(async ({ ctx, input }) => {
      // Get IP address from headers (for rate limiting)
      const forwardedFor = ctx.headers.get("x-forwarded-for");
      const realIp = ctx.headers.get("x-real-ip");
      const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "127.0.0.1";

      // Rate limiting check
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Check hourly limit
      const [hourlyCount] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(
          and(
            eq(feedback.ipAddress, ipAddress),
            gte(feedback.createdAt, oneHourAgo)
          )
        );

      if ((hourlyCount?.count ?? 0) >= FEEDBACK_RATE_LIMIT.MAX_PER_HOUR) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Слишком много обращений. Попробуйте позже.",
        });
      }

      // Check daily limit
      const [dailyCount] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(
          and(
            eq(feedback.ipAddress, ipAddress),
            gte(feedback.createdAt, oneDayAgo)
          )
        );

      if ((dailyCount?.count ?? 0) >= FEEDBACK_RATE_LIMIT.MAX_PER_DAY) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Достигнут лимит обращений на сегодня. Попробуйте завтра.",
        });
      }

      // Get user ID if authenticated (but store anonymously)
      const userId = ctx.session?.user?.id;

      // Auto-fill contact info from user profile if authenticated and not provided
      let contactName = input.contactName;
      let contactEmail = input.contactEmail;

      if (userId && !contactName) {
        contactName = ctx.session?.user?.name ?? undefined;
      }
      if (userId && !contactEmail) {
        contactEmail = ctx.session?.user?.email ?? undefined;
      }

      // Create feedback
      const [newFeedback] = await ctx.db
        .insert(feedback)
        .values({
          type: input.type,
          title: input.title?.trim() || null,
          content: input.content.trim(),
          contactName: contactName?.trim() || null,
          contactEmail: contactEmail?.trim() || null,
          contactPhone: input.contactPhone?.trim() || null,
          attachments: input.attachments ?? [],
          photos: input.photos ?? [],
          submittedByUserId: userId,
          ipAddress,
          isAnonymous: true, // Always anonymous from admin perspective
        })
        .returning({ id: feedback.id });

      // Log creation in history (system action, no changedById for anonymous)
      if (newFeedback?.id) {
        await ctx.db.insert(feedbackHistory).values({
          feedbackId: newFeedback.id,
          action: "created",
          toStatus: "new",
          description: "Обращение создано",
          changedById: userId ?? null,
        });
      }

      return {
        success: true,
        id: newFeedback?.id,
        message: "Ваше обращение успешно отправлено. Спасибо!",
      };
    }),

  // ==================== Admin Procedures ====================

  admin: createTRPCRouter({
    /**
     * List all feedback for admin
     */
    list: adminProcedureWithFeature("users:manage")
      .input(
        z.object({
          status: feedbackStatusSchema.optional(),
          type: feedbackTypeSchema.optional(),
          priority: feedbackPrioritySchema.optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, status, type, priority } = input;
        const offset = (page - 1) * limit;

        const conditions = [eq(feedback.isDeleted, false)];
        if (status) {
          conditions.push(eq(feedback.status, status));
        }
        if (type) {
          conditions.push(eq(feedback.type, type));
        }
        if (priority) {
          conditions.push(eq(feedback.priority, priority));
        }

        const whereClause = and(...conditions);

        const items = await ctx.db.query.feedback.findMany({
          where: whereClause,
          with: {
            assignedTo: {
              columns: {
                id: true,
                name: true,
              },
            },
            respondedBy: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [desc(feedback.createdAt)],
          limit,
          offset,
        });

        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(feedback)
          .where(whereClause);

        // Count by status for filters
        const [newCount] = await ctx.db
          .select({ count: count() })
          .from(feedback)
          .where(and(eq(feedback.status, "new"), eq(feedback.isDeleted, false)));

        const [inProgressCount] = await ctx.db
          .select({ count: count() })
          .from(feedback)
          .where(and(eq(feedback.status, "in_progress"), eq(feedback.isDeleted, false)));

        return {
          items,
          total: totalResult?.count ?? 0,
          page,
          totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
          counts: {
            new: newCount?.count ?? 0,
            inProgress: inProgressCount?.count ?? 0,
          },
        };
      }),

    /**
     * Get single feedback by ID
     */
    byId: adminProcedureWithFeature("users:manage")
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const item = await ctx.db.query.feedback.findFirst({
          where: and(eq(feedback.id, input.id), eq(feedback.isDeleted, false)),
          with: {
            assignedTo: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
            respondedBy: {
              columns: {
                id: true,
                name: true,
              },
            },
            history: {
              orderBy: [desc(feedbackHistory.createdAt)],
              with: {
                changedBy: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!item) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Обращение не найдено",
          });
        }

        return item;
      }),

    /**
     * Update feedback status and details
     */
    update: adminProcedureWithFeature("users:manage")
      .input(
        z.object({
          id: z.string().uuid(),
          status: feedbackStatusSchema.optional(),
          priority: feedbackPrioritySchema.optional(),
          assignedToId: z.string().nullable().optional(),
          forwardedTo: z.string().max(500).nullable().optional(),
          internalNote: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;
        const adminId = ctx.session.user.id;

        const existing = await ctx.db.query.feedback.findFirst({
          where: eq(feedback.id, id),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Обращение не найдено",
          });
        }

        // Update feedback
        await ctx.db
          .update(feedback)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(feedback.id, id));

        // Log status change
        if (input.status && input.status !== existing.status) {
          const fromLabel = FEEDBACK_STATUS_LABELS[existing.status];
          const toLabel = FEEDBACK_STATUS_LABELS[input.status];

          await ctx.db.insert(feedbackHistory).values({
            feedbackId: id,
            action: "status_changed",
            fromStatus: existing.status,
            toStatus: input.status,
            changedById: adminId,
            description: `Статус изменён: ${fromLabel} → ${toLabel}`,
          });
        }

        // Log priority change
        if (input.priority && input.priority !== existing.priority) {
          const fromLabel = FEEDBACK_PRIORITY_LABELS[existing.priority];
          const toLabel = FEEDBACK_PRIORITY_LABELS[input.priority];

          await ctx.db.insert(feedbackHistory).values({
            feedbackId: id,
            action: "priority_changed",
            fromPriority: existing.priority,
            toPriority: input.priority,
            changedById: adminId,
            description: `Приоритет изменён: ${fromLabel} → ${toLabel}`,
          });
        }

        // Log assignment
        if (input.assignedToId !== undefined && input.assignedToId !== existing.assignedToId) {
          if (input.assignedToId) {
            await ctx.db.insert(feedbackHistory).values({
              feedbackId: id,
              action: "assigned",
              assignedToId: input.assignedToId,
              changedById: adminId,
              description: "Назначен ответственный",
            });
          } else {
            await ctx.db.insert(feedbackHistory).values({
              feedbackId: id,
              action: "unassigned",
              changedById: adminId,
              description: "Снят ответственный",
            });
          }
        }

        // Log forwarding
        if (input.forwardedTo && input.forwardedTo !== existing.forwardedTo) {
          await ctx.db.insert(feedbackHistory).values({
            feedbackId: id,
            action: "forwarded",
            forwardedTo: input.forwardedTo,
            changedById: adminId,
            description: `Перенаправлено: ${input.forwardedTo}`,
          });
        }

        // Log internal note
        if (input.internalNote && input.internalNote !== existing.internalNote) {
          await ctx.db.insert(feedbackHistory).values({
            feedbackId: id,
            action: "note_added",
            internalNote: input.internalNote,
            changedById: adminId,
            description: "Добавлена заметка",
          });
        }

        return { success: true };
      }),

    /**
     * Respond to feedback
     */
    respond: adminProcedureWithFeature("users:manage")
      .input(
        z.object({
          id: z.string().uuid(),
          response: z.string().min(1, "Ответ не может быть пустым").max(4000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const adminId = ctx.session.user.id;

        const existing = await ctx.db.query.feedback.findFirst({
          where: eq(feedback.id, input.id),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Обращение не найдено",
          });
        }

        await ctx.db
          .update(feedback)
          .set({
            response: input.response,
            respondedAt: new Date(),
            respondedById: adminId,
            status: "resolved",
            updatedAt: new Date(),
          })
          .where(eq(feedback.id, input.id));

        // Log response
        await ctx.db.insert(feedbackHistory).values({
          feedbackId: input.id,
          action: "responded",
          response: input.response,
          fromStatus: existing.status,
          toStatus: "resolved",
          changedById: adminId,
          description: "Дан ответ на обращение",
        });

        // TODO: Send email notification to contactEmail if provided

        return { success: true };
      }),

    /**
     * Get history for a feedback
     */
    history: adminProcedureWithFeature("users:manage")
      .input(z.object({ feedbackId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const history = await ctx.db.query.feedbackHistory.findMany({
          where: eq(feedbackHistory.feedbackId, input.feedbackId),
          orderBy: [desc(feedbackHistory.createdAt)],
          with: {
            changedBy: {
              columns: {
                id: true,
                name: true,
              },
            },
            assignedTo: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        });

        return history;
      }),

    /**
     * Get statistics
     */
    stats: adminProcedureWithFeature("users:manage").query(async ({ ctx }) => {
      const baseCondition = eq(feedback.isDeleted, false);

      const [total] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(baseCondition);

      const [newCount] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(and(eq(feedback.status, "new"), baseCondition));

      const [inProgressCount] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(and(eq(feedback.status, "in_progress"), baseCondition));

      const [resolvedCount] = await ctx.db
        .select({ count: count() })
        .from(feedback)
        .where(and(eq(feedback.status, "resolved"), baseCondition));

      // Count by type
      const byType = await ctx.db
        .select({
          type: feedback.type,
          count: count(),
        })
        .from(feedback)
        .where(baseCondition)
        .groupBy(feedback.type);

      return {
        total: total?.count ?? 0,
        new: newCount?.count ?? 0,
        inProgress: inProgressCount?.count ?? 0,
        resolved: resolvedCount?.count ?? 0,
        byType: byType.reduce(
          (acc, item) => {
            acc[item.type] = item.count;
            return acc;
          },
          {} as Record<string, number>
        ),
      };
    }),
  }),
});
