import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { media, mediaTypeEnum } from "~/server/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedureWithFeature,
} from "../trpc";

// ============================================================================
// Validation Schemas
// ============================================================================

const mediaTypeSchema = z.enum(mediaTypeEnum.enumValues);

const createMediaSchema = z.object({
  filename: z.string().min(1).max(255),
  originalFilename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size: z.number().int().positive(),
  path: z.string().min(1).max(500),
  url: z.string().min(1).max(500),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  type: mediaTypeSchema.default("image"),
  alt: z.string().max(255).optional(),
  title: z.string().max(255).optional(),
  description: z.string().optional(),
});

const updateMediaSchema = z.object({
  id: z.string().uuid(),
  alt: z.string().max(255).optional(),
  title: z.string().max(255).optional(),
  description: z.string().optional(),
});

// ============================================================================
// Router
// ============================================================================

export const mediaRouter = createTRPCRouter({
  // ========================================
  // Protected Procedures (for authenticated users)
  // ========================================

  /**
   * List media items with pagination
   */
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(24),
        type: mediaTypeSchema.optional(),
        search: z.string().optional(),
        onlyMine: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, type, search, onlyMine } = input;
      const offset = (page - 1) * limit;

      const conditions = [];

      // Filter by type
      if (type) {
        conditions.push(eq(media.type, type));
      }

      // Filter by owner if onlyMine
      if (onlyMine) {
        conditions.push(eq(media.uploadedBy, ctx.session.user.id));
      }

      // Search by filename or alt text
      if (search) {
        conditions.push(
          or(
            ilike(media.originalFilename, `%${search}%`),
            ilike(media.alt, `%${search}%`),
            ilike(media.title, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalCount] = await Promise.all([
        ctx.db.query.media.findMany({
          where: whereClause,
          orderBy: [desc(media.createdAt)],
          limit,
          offset,
          with: {
            uploader: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.select({ count: count() }).from(media).where(whereClause),
      ]);

      return {
        items,
        total: totalCount[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((totalCount[0]?.count ?? 0) / limit),
      };
    }),

  /**
   * Get single media item by ID
   */
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.media.findFirst({
        where: eq(media.id, input.id),
        with: {
          uploader: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Медиафайл не найден",
        });
      }

      return item;
    }),

  /**
   * Create media record (called after file upload)
   */
  create: protectedProcedure
    .input(createMediaSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(media)
        .values({
          ...input,
          uploadedBy: ctx.session.user.id,
        })
        .returning();

      return created;
    }),

  /**
   * Update media metadata
   */
  update: protectedProcedure
    .input(updateMediaSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check existence and ownership
      const existing = await ctx.db.query.media.findFirst({
        where: eq(media.id, id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Медиафайл не найден",
        });
      }

      // Allow update only if owner or admin
      const isAdmin = ctx.session.user.roles?.some((role) =>
        ["Root", "SuperAdmin", "Admin"].includes(role)
      );
      if (existing.uploadedBy !== ctx.session.user.id && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет прав на редактирование",
        });
      }

      const [updated] = await ctx.db
        .update(media)
        .set(data)
        .where(eq(media.id, id))
        .returning();

      return updated;
    }),

  /**
   * Delete media item
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.media.findFirst({
        where: eq(media.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Медиафайл не найден",
        });
      }

      // Allow delete only if owner or admin
      const isAdmin = ctx.session.user.roles?.some((role) =>
        ["Root", "SuperAdmin", "Admin"].includes(role)
      );
      if (existing.uploadedBy !== ctx.session.user.id && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет прав на удаление",
        });
      }

      // Delete file from disk
      try {
        const { deleteImage } = await import("~/lib/upload");
        await deleteImage(existing.path);
      } catch (error) {
        console.error("Failed to delete file:", error);
      }

      await ctx.db.delete(media).where(eq(media.id, input.id));

      return { success: true };
    }),

  // ========================================
  // Admin Procedures
  // ========================================

  /**
   * Admin: Get all media with full info
   */
  adminList: adminProcedureWithFeature("directory:manage")
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(24),
        type: mediaTypeSchema.optional(),
        search: z.string().optional(),
        uploadedBy: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, type, search, uploadedBy } = input;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (type) {
        conditions.push(eq(media.type, type));
      }

      if (uploadedBy) {
        conditions.push(eq(media.uploadedBy, uploadedBy));
      }

      if (search) {
        conditions.push(
          or(
            ilike(media.originalFilename, `%${search}%`),
            ilike(media.alt, `%${search}%`),
            ilike(media.title, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalCount] = await Promise.all([
        ctx.db.query.media.findMany({
          where: whereClause,
          orderBy: [desc(media.createdAt)],
          limit,
          offset,
          with: {
            uploader: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.select({ count: count() }).from(media).where(whereClause),
      ]);

      return {
        items,
        total: totalCount[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((totalCount[0]?.count ?? 0) / limit),
      };
    }),

  /**
   * Admin: Get media stats
   */
  stats: adminProcedureWithFeature("directory:manage").query(async ({ ctx }) => {
    const [imageCount, documentCount, totalCount, totalSize] = await Promise.all([
      ctx.db
        .select({ count: count() })
        .from(media)
        .where(eq(media.type, "image")),
      ctx.db
        .select({ count: count() })
        .from(media)
        .where(eq(media.type, "document")),
      ctx.db.select({ count: count() }).from(media),
      ctx.db
        .select({ total: count() })
        .from(media),
    ]);

    return {
      images: imageCount[0]?.count ?? 0,
      documents: documentCount[0]?.count ?? 0,
      total: totalCount[0]?.count ?? 0,
    };
  }),
});
