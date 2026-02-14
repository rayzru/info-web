import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { infoNewsToTag, infoPublicationToTag, infoTag } from "~/server/db/schema";

import {
  adminProcedureWithFeature,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

// ============================================================================
// Validation Schemas
// ============================================================================

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

const updateTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .nullable()
    .optional(),
});

const assignTagsSchema = z.object({
  entityType: z.enum(["news", "publication"]),
  entityId: z.string().uuid(),
  tagIds: z.array(z.string().uuid()).min(1),
});

const removeTagsSchema = z.object({
  entityType: z.enum(["news", "publication"]),
  entityId: z.string().uuid(),
  tagIds: z.array(z.string().uuid()).min(1),
});

// ============================================================================
// Helper Functions
// ============================================================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яё0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================================
// Router
// ============================================================================

export const tagsRouter = createTRPCRouter({
  // ========================================
  // Public Procedures
  // ========================================

  /**
   * List all active tags
   */
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(ilike(infoTag.name, `%${input.search}%`));
      }

      const tags = await ctx.db.query.infoTag.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(infoTag.usageCount), infoTag.name],
        limit: input.limit,
      });

      return tags;
    }),

  /**
   * Get popular tags
   */
  popular: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const tags = await ctx.db.query.infoTag.findMany({
        orderBy: [desc(infoTag.usageCount)],
        limit: input.limit,
      });

      return tags;
    }),

  /**
   * Get tag by ID
   */
  byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const tag = await ctx.db.query.infoTag.findFirst({
      where: eq(infoTag.id, input.id),
    });

    if (!tag) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Тег не найден",
      });
    }

    return tag;
  }),

  /**
   * Get tags for an entity
   */
  forEntity: publicProcedure
    .input(
      z.object({
        entityType: z.enum(["news", "publication"]),
        entityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { entityType, entityId } = input;

      let junctionTable;
      let idField;

      switch (entityType) {
        case "news":
          junctionTable = infoNewsToTag;
          idField = infoNewsToTag.newsId;
          break;
        case "publication":
          junctionTable = infoPublicationToTag;
          idField = infoPublicationToTag.publicationId;
          break;
      }

      const relations = await ctx.db
        .select({
          tag: infoTag,
        })
        .from(junctionTable)
        .innerJoin(infoTag, eq(junctionTable.tagId, infoTag.id))
        .where(eq(idField, entityId));

      return relations.map((r) => r.tag);
    }),

  // ========================================
  // Protected Procedures
  // ========================================

  /**
   * Create a new tag
   */
  create: protectedProcedure.input(createTagSchema).mutation(async ({ ctx, input }) => {
    const slug = generateSlug(input.name);

    // Check if tag with this slug already exists
    const existing = await ctx.db.query.infoTag.findFirst({
      where: eq(infoTag.slug, slug),
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Тег с таким именем уже существует",
      });
    }

    const [created] = await ctx.db
      .insert(infoTag)
      .values({
        name: input.name,
        slug,
        color: input.color,
      })
      .returning();

    return created;
  }),

  /**
   * Assign tags to an entity
   */
  assign: protectedProcedure.input(assignTagsSchema).mutation(async ({ ctx, input }) => {
    const { entityType, entityId, tagIds } = input;

    let junctionTable;

    switch (entityType) {
      case "news":
        junctionTable = infoNewsToTag;
        break;
      case "publication":
        junctionTable = infoPublicationToTag;
        break;
    }

    // Insert tag assignments
    const values = tagIds.map((tagId) => {
      switch (entityType) {
        case "news":
          return { newsId: entityId, tagId };
        case "publication":
          return { publicationId: entityId, tagId };
      }
    });

    await ctx.db.insert(junctionTable).values(values).onConflictDoNothing();

    // Update usage count for each tag
    for (const tagId of tagIds) {
      await ctx.db
        .update(infoTag)
        .set({
          usageCount: sql`${infoTag.usageCount} + 1`,
        })
        .where(eq(infoTag.id, tagId));
    }

    return { success: true };
  }),

  /**
   * Remove tags from an entity
   */
  remove: protectedProcedure.input(removeTagsSchema).mutation(async ({ ctx, input }) => {
    const { entityType, entityId, tagIds } = input;

    let junctionTable;
    let idField;
    let tagIdField;

    switch (entityType) {
      case "news":
        junctionTable = infoNewsToTag;
        idField = infoNewsToTag.newsId;
        tagIdField = infoNewsToTag.tagId;
        break;
      case "publication":
        junctionTable = infoPublicationToTag;
        idField = infoPublicationToTag.publicationId;
        tagIdField = infoPublicationToTag.tagId;
        break;
    }

    // Delete tag assignments
    await ctx.db
      .delete(junctionTable)
      .where(and(eq(idField, entityId), sql`${tagIdField} = ANY(${tagIds})`));

    // Update usage count for each tag
    for (const tagId of tagIds) {
      await ctx.db
        .update(infoTag)
        .set({
          usageCount: sql`GREATEST(0, ${infoTag.usageCount} - 1)`,
        })
        .where(eq(infoTag.id, tagId));
    }

    return { success: true };
  }),

  // ========================================
  // Admin Procedures
  // ========================================

  /**
   * Admin: Update tag
   */
  update: adminProcedureWithFeature("content:moderate")
    .input(updateTagSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.query.infoTag.findFirst({
        where: eq(infoTag.id, id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Тег не найден",
        });
      }

      // Update slug if name changed
      const updates: any = { ...data };
      if (data.name && data.name !== existing.name) {
        updates.slug = generateSlug(data.name);
      }

      const [updated] = await ctx.db
        .update(infoTag)
        .set(updates)
        .where(eq(infoTag.id, id))
        .returning();

      return updated;
    }),

  /**
   * Admin: Delete tag
   */
  delete: adminProcedureWithFeature("content:moderate")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.infoTag.findFirst({
        where: eq(infoTag.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Тег не найден",
        });
      }

      await ctx.db.delete(infoTag).where(eq(infoTag.id, input.id));

      return { success: true };
    }),

  /**
   * Admin: Get tag statistics
   */
  stats: adminProcedureWithFeature("content:moderate").query(async ({ ctx }) => {
    const [totalCount] = await ctx.db.select({ count: count() }).from(infoTag);

    const topTags = await ctx.db.query.infoTag.findMany({
      orderBy: [desc(infoTag.usageCount)],
      limit: 10,
    });

    return {
      total: totalCount?.count ?? 0,
      topTags,
    };
  }),
});
