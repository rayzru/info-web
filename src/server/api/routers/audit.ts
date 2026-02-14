import { and, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { z } from "zod";

import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  auditActionEnum,
  auditEntityTypeEnum,
  auditLogs,
  FEEDBACK_HISTORY_ACTION_LABELS,
  feedbackHistory,
  PUBLICATION_HISTORY_ACTION_LABELS,
  publicationHistory,
} from "~/server/db/schema";

import { adminProcedureWithFeature, createTRPCRouter } from "../trpc";

// ============================================================================
// Router
// ============================================================================

export const auditRouter = createTRPCRouter({
  /**
   * Get aggregated audit logs for admin panel
   * Combines: audit_logs, feedback_history, publication_history
   */
  list: adminProcedureWithFeature("system:logs")
    .input(
      z.object({
        entityType: z.enum(auditEntityTypeEnum.enumValues).optional(),
        action: z.enum(auditActionEnum.enumValues).optional(),
        actorId: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, entityType, action, actorId, dateFrom, dateTo, search } = input;
      const offset = (page - 1) * limit;

      // Build conditions for audit_logs
      const conditions = [];
      if (entityType) {
        conditions.push(eq(auditLogs.entityType, entityType));
      }
      if (action) {
        conditions.push(eq(auditLogs.action, action));
      }
      if (actorId) {
        conditions.push(eq(auditLogs.actorId, actorId));
      }
      if (dateFrom) {
        conditions.push(gte(auditLogs.createdAt, dateFrom));
      }
      if (dateTo) {
        conditions.push(lte(auditLogs.createdAt, dateTo));
      }
      if (search) {
        conditions.push(
          or(ilike(auditLogs.description, `%${search}%`), ilike(auditLogs.entityId, `%${search}%`))
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Fetch audit logs
      const items = await ctx.db.query.auditLogs.findMany({
        where: whereClause,
        with: {
          actor: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [desc(auditLogs.createdAt)],
        limit,
        offset,
      });

      // Count total
      const allItems = await ctx.db.query.auditLogs.findMany({
        where: whereClause,
        columns: { id: true },
      });
      const total = allItems.length;

      return {
        items: items.map((item) => ({
          id: item.id,
          entityType: item.entityType,
          entityTypeLabel: AUDIT_ENTITY_LABELS[item.entityType],
          entityId: item.entityId,
          action: item.action,
          actionLabel: AUDIT_ACTION_LABELS[item.action],
          description: item.description,
          actor: item.actor,
          metadata: item.metadata,
          ipAddress: item.ipAddress,
          createdAt: item.createdAt,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  /**
   * Get feedback history logs
   */
  feedbackHistory: adminProcedureWithFeature("system:logs")
    .input(
      z.object({
        feedbackId: z.string().uuid().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, feedbackId } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (feedbackId) {
        conditions.push(eq(feedbackHistory.feedbackId, feedbackId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await ctx.db.query.feedbackHistory.findMany({
        where: whereClause,
        with: {
          changedBy: {
            columns: {
              id: true,
              name: true,
            },
          },
          feedback: {
            columns: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
        orderBy: [desc(feedbackHistory.createdAt)],
        limit,
        offset,
      });

      const allItems = await ctx.db.query.feedbackHistory.findMany({
        where: whereClause,
        columns: { id: true },
      });
      const total = allItems.length;

      return {
        items: items.map((item) => ({
          id: item.id,
          feedbackId: item.feedbackId,
          feedback: item.feedback,
          action: item.action,
          actionLabel: FEEDBACK_HISTORY_ACTION_LABELS[item.action],
          description: item.description,
          fromStatus: item.fromStatus,
          toStatus: item.toStatus,
          fromPriority: item.fromPriority,
          toPriority: item.toPriority,
          changedBy: item.changedBy,
          createdAt: item.createdAt,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  /**
   * Get publication history logs
   */
  publicationHistory: adminProcedureWithFeature("system:logs")
    .input(
      z.object({
        publicationId: z.string().uuid().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, publicationId } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (publicationId) {
        conditions.push(eq(publicationHistory.publicationId, publicationId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await ctx.db.query.publicationHistory.findMany({
        where: whereClause,
        with: {
          changedBy: {
            columns: {
              id: true,
              name: true,
            },
          },
          publication: {
            columns: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
        orderBy: [desc(publicationHistory.createdAt)],
        limit,
        offset,
      });

      const allItems = await ctx.db.query.publicationHistory.findMany({
        where: whereClause,
        columns: { id: true },
      });
      const total = allItems.length;

      return {
        items: items.map((item) => ({
          id: item.id,
          publicationId: item.publicationId,
          publication: item.publication,
          action: item.action,
          actionLabel: PUBLICATION_HISTORY_ACTION_LABELS[item.action],
          description: item.description,
          fromStatus: item.fromStatus,
          toStatus: item.toStatus,
          moderationComment: item.moderationComment,
          changedBy: item.changedBy,
          createdAt: item.createdAt,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  /**
   * Get available filter options
   */
  filterOptions: adminProcedureWithFeature("system:logs").query(() => {
    return {
      entityTypes: auditEntityTypeEnum.enumValues.map((value) => ({
        value,
        label: AUDIT_ENTITY_LABELS[value],
      })),
      actions: auditActionEnum.enumValues.map((value) => ({
        value,
        label: AUDIT_ACTION_LABELS[value],
      })),
    };
  }),
});
