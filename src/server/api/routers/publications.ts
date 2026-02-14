import type { JSONContent } from "@tiptap/react";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte, inArray, isNull, lte, ne, or, sql } from "drizzle-orm";
import { z } from "zod";

import { deleteImage } from "~/lib/upload/image-processor";
import {
  eventRecurrenceTypeEnum,
  publications,
  publicationStatusEnum,
  publicationTags,
  publicationTargets,
  publicationTypeEnum,
  userApartments,
  userInterestBuildings,
  userParkingSpots,
  userRoles,
} from "~/server/db/schema";
import { sendTelegramNotificationAsync } from "~/server/notifications/telegram";

import {
  adminProcedureWithFeature,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

// ============================================================================
// Validation Schemas
// ============================================================================

const publicationTypeSchema = z.enum(publicationTypeEnum.enumValues);
const publicationStatusSchema = z.enum(publicationStatusEnum.enumValues);

// Event recurrence schema
const eventRecurrenceTypeSchema = z.enum(eventRecurrenceTypeEnum.enumValues);

// Event-specific fields schema
const eventFieldsSchema = z.object({
  eventStartAt: z.date().optional(),
  eventEndAt: z.date().optional(),
  eventLocation: z.string().max(500).optional(),
  eventLatitude: z.string().optional(),
  eventLongitude: z.string().optional(),
  eventMaxAttendees: z.number().int().min(0).optional(),
  eventExternalUrl: z.string().url().max(500).optional(),
  eventOrganizer: z.string().max(255).optional(),
  eventOrganizerPhone: z.string().max(20).optional(),
  // Recurrence fields
  eventRecurrenceType: eventRecurrenceTypeSchema.optional(),
  eventRecurrenceInterval: z.number().int().min(1).max(365).optional(),
  eventRecurrenceDayOfWeek: z.number().int().min(0).max(6).optional(),
  eventRecurrenceStartDay: z.number().int().min(1).max(31).optional(),
  eventRecurrenceEndDay: z.number().int().min(1).max(31).optional(),
  eventRecurrenceUntil: z.date().optional(),
  linkedArticleId: z.string().uuid().optional(),
});

// Target for publication binding
const publicationTargetSchema = z.object({
  targetType: z.enum(["complex", "uk", "building", "entrance", "floor"]),
  targetId: z.string().optional(), // null for complex/uk
});

const createPublicationSchema = z
  .object({
    title: z.string().min(1).max(255),
    content: z.any() as z.ZodType<JSONContent>,
    coverImage: z.string().optional(),
    type: publicationTypeSchema.default("announcement"),
    buildingId: z.string().optional(), // К какому строению относится (legacy)
    targets: z.array(publicationTargetSchema).optional(), // Новая система привязок
    isUrgent: z.boolean().default(false),
    isAnonymous: z.boolean().default(false), // Анонимная публикация
    publishAt: z.date().optional(), // Планируемая дата публикации
    publishToTelegram: z.boolean().default(false), // Публикация в Telegram
    tagIds: z.array(z.string()).optional(),
    // Event-specific fields (required when type is "event")
    ...eventFieldsSchema.shape,
  })
  .refine(
    (data) => {
      // If type is "event", eventStartAt is required
      if (data.type === "event" && !data.eventStartAt) {
        return false;
      }
      return true;
    },
    {
      message: "Дата начала события обязательна для мероприятий",
      path: ["eventStartAt"],
    }
  );

const updatePublicationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  content: (z.any() as z.ZodType<JSONContent>).optional(),
  coverImage: z.string().nullable().optional(),
  type: publicationTypeSchema.optional(),
  buildingId: z.string().nullable().optional(),
  targets: z.array(publicationTargetSchema).optional(),
  isUrgent: z.boolean().optional(),
  isAnonymous: z.boolean().optional(),
  publishAt: z.date().nullable().optional(),
  publishToTelegram: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
  // Event-specific fields
  eventStartAt: z.date().nullable().optional(),
  eventEndAt: z.date().nullable().optional(),
  eventLocation: z.string().max(500).nullable().optional(),
  eventLatitude: z.string().nullable().optional(),
  eventLongitude: z.string().nullable().optional(),
  eventMaxAttendees: z.number().int().min(0).nullable().optional(),
  eventExternalUrl: z.string().url().max(500).nullable().optional(),
  eventOrganizer: z.string().max(255).nullable().optional(),
  eventOrganizerPhone: z.string().max(20).nullable().optional(),
  // Event recurrence fields
  eventRecurrenceType: eventRecurrenceTypeSchema.nullable().optional(),
  eventRecurrenceInterval: z.number().int().min(1).max(365).nullable().optional(),
  eventRecurrenceDayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
  eventRecurrenceStartDay: z.number().int().min(1).max(31).nullable().optional(),
  eventRecurrenceEndDay: z.number().int().min(1).max(31).nullable().optional(),
  eventRecurrenceUntil: z.date().nullable().optional(),
  linkedArticleId: z.string().uuid().nullable().optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Roles that can create publications
 */
const PUBLICATION_ROLES = [
  "ApartmentOwner",
  "ApartmentResident",
  "ParkingOwner",
  "ParkingResident",
  "Editor",
  "Moderator",
  "Admin",
  "SuperAdmin",
  "Root",
  "ComplexChairman",
  "ComplexRepresenative",
  "BuildingChairman",
] as const;

/**
 * Check if user can create publications
 */
async function canUserPublish(
  db: typeof import("~/server/db").db,
  userId: string
): Promise<boolean> {
  // Check if user has any of the allowed roles
  const roles = await db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
  });

  const userRoleNames = roles.map((r) => r.role);
  return userRoleNames.some((role) =>
    PUBLICATION_ROLES.includes(role as (typeof PUBLICATION_ROLES)[number])
  );
}

/**
 * Get user's buildings from property ownership and interest settings
 */
async function getUserBuildings(
  db: typeof import("~/server/db").db,
  userId: string
): Promise<string[]> {
  const buildingIds = new Set<string>();

  // From interest buildings
  const interests = await db.query.userInterestBuildings.findMany({
    where: eq(userInterestBuildings.userId, userId),
  });
  interests.forEach((i) => buildingIds.add(i.buildingId));

  // From owned/rented apartments
  const apartments = await db.query.userApartments.findMany({
    where: and(eq(userApartments.userId, userId), sql`${userApartments.revokedAt} IS NULL`),
    with: {
      apartment: {
        with: {
          floor: {
            with: {
              entrance: true,
            },
          },
        },
      },
    },
  });
  apartments.forEach((a) => {
    const buildingId = a.apartment?.floor?.entrance?.buildingId;
    if (buildingId) buildingIds.add(buildingId);
  });

  // From owned/rented parking spots
  const parkings = await db.query.userParkingSpots.findMany({
    where: and(eq(userParkingSpots.userId, userId), sql`${userParkingSpots.revokedAt} IS NULL`),
    with: {
      parkingSpot: {
        with: {
          floor: {
            with: {
              parking: true,
            },
          },
        },
      },
    },
  });
  parkings.forEach((p) => {
    const buildingId = p.parkingSpot?.floor?.parking?.buildingId;
    if (buildingId) buildingIds.add(buildingId);
  });

  return Array.from(buildingIds);
}

// ============================================================================
// Router
// ============================================================================

export const publicationsRouter = createTRPCRouter({
  // ==================== User Procedures ====================

  /**
   * Check if current user can create publications
   */
  canPublish: protectedProcedure.query(async ({ ctx }) => {
    return canUserPublish(ctx.db, ctx.session.user.id);
  }),

  /**
   * Get current user's publications
   */
  my: protectedProcedure
    .input(
      z.object({
        status: publicationStatusSchema.optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(publications.authorId, userId)];
      if (status) {
        conditions.push(eq(publications.status, status));
      }

      const items = await ctx.db.query.publications.findMany({
        where: and(...conditions),
        with: {
          building: true,
          publicationTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: desc(publications.createdAt),
        limit,
        offset,
      });

      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(and(...conditions));

      return {
        items,
        total: totalResult?.count ?? 0,
        page,
        totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
      };
    }),

  /**
   * Create a new publication
   */
  create: protectedProcedure.input(createPublicationSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // Check if user can publish
    const canPublish = await canUserPublish(ctx.db, userId);
    if (!canPublish) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Для создания публикаций необходимо иметь подтверждённую собственность или соответствующую роль",
      });
    }

    // Validate building access if buildingId is provided
    if (input.buildingId) {
      const userBuildings = await getUserBuildings(ctx.db, userId);
      if (!userBuildings.includes(input.buildingId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "У вас нет доступа к этому строению",
        });
      }
    }

    // Create publication (goes to moderation for regular users)
    const userRolesData = await ctx.db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
    });
    const isAdmin = userRolesData.some((r) =>
      ["Root", "SuperAdmin", "Admin", "Editor", "Moderator"].includes(r.role)
    );

    const [publication] = await ctx.db
      .insert(publications)
      .values({
        title: input.title,
        content: input.content,
        coverImage: input.coverImage,
        type: input.type,
        status: isAdmin ? "published" : "pending", // Admins bypass moderation
        buildingId: input.buildingId,
        isUrgent: input.isUrgent,
        isAnonymous: input.isAnonymous,
        publishAt: input.publishAt,
        publishToTelegram: isAdmin ? input.publishToTelegram : false, // Only admins can publish to TG
        authorId: userId,
        // Event-specific fields
        eventStartAt: input.eventStartAt,
        eventEndAt: input.eventEndAt,
        eventLocation: input.eventLocation,
        eventLatitude: input.eventLatitude,
        eventLongitude: input.eventLongitude,
        eventMaxAttendees: input.eventMaxAttendees,
        eventExternalUrl: input.eventExternalUrl,
        eventOrganizer: input.eventOrganizer,
        eventOrganizerPhone: input.eventOrganizerPhone,
        // Event recurrence fields
        eventRecurrenceType: input.eventRecurrenceType,
        eventRecurrenceInterval: input.eventRecurrenceInterval,
        eventRecurrenceDayOfWeek: input.eventRecurrenceDayOfWeek,
        eventRecurrenceStartDay: input.eventRecurrenceStartDay,
        eventRecurrenceEndDay: input.eventRecurrenceEndDay,
        eventRecurrenceUntil: input.eventRecurrenceUntil,
        linkedArticleId: input.linkedArticleId,
      })
      .returning();

    if (!publication) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось создать публикацию",
      });
    }

    // Add tags
    if (input.tagIds && input.tagIds.length > 0) {
      await ctx.db.insert(publicationTags).values(
        input.tagIds.map((tagId) => ({
          publicationId: publication.id,
          tagId,
        }))
      );
    }

    // Add targets
    if (input.targets && input.targets.length > 0) {
      await ctx.db.insert(publicationTargets).values(
        input.targets.map((target) => ({
          publicationId: publication.id,
          targetType: target.targetType,
          targetId: target.targetId ?? null,
        }))
      );
    }

    // Send Telegram notification
    const typeName: Record<string, string> = {
      announcement: "объявление",
      event: "мероприятие",
      help_request: "просьбу о помощи",
      lost_found: "сообщение о потере/находке",
      recommendation: "рекомендацию",
      poll: "опрос",
      discussion: "обсуждение",
      news: "новость",
      question: "вопрос",
    };
    const typeLabel = typeName[input.type] ?? "публикацию";

    sendTelegramNotificationAsync({
      event: isAdmin ? "publication_published" : "publication_created",
      title: isAdmin ? `Опубликовано ${typeLabel}` : `Создано ${typeLabel}`,
      description: input.title,
      metadata: {
        Тип: typeLabel,
        Статус: isAdmin ? "Опубликовано" : "На модерации",
        ...(input.isUrgent ? { Срочно: "Да" } : {}),
      },
      userName: ctx.session.user.name ?? ctx.session.user.email ?? undefined,
    });

    return publication;
  }),

  /**
   * Update own publication (authors and admins can edit published items)
   */
  update: protectedProcedure.input(updatePublicationSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { id, tagIds, ...updateData } = input;

    // Check if user is admin
    const userRolesData = await ctx.db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
    });
    const isAdmin = userRolesData.some((r) =>
      ["Root", "SuperAdmin", "Admin", "Editor", "Moderator"].includes(r.role)
    );

    // Find publication
    const existing = await ctx.db.query.publications.findFirst({
      where: eq(publications.id, id),
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Публикация не найдена",
      });
    }

    const isAuthor = existing.authorId === userId;

    // Check permission: must be author or admin
    if (!isAuthor && !isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Вы не можете редактировать чужую публикацию",
      });
    }

    // Validate building access if changing buildingId (only for non-admins)
    if (!isAdmin && updateData.buildingId && updateData.buildingId !== existing.buildingId) {
      const userBuildings = await getUserBuildings(ctx.db, userId);
      if (!userBuildings.includes(updateData.buildingId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "У вас нет доступа к этому строению",
        });
      }
    }

    // Delete old cover image from S3 if it's being replaced
    if (updateData.coverImage !== undefined && existing.coverImage) {
      if (updateData.coverImage !== existing.coverImage) {
        try {
          await deleteImage(existing.coverImage);
          console.log(`[Publications] Deleted old cover image: ${existing.coverImage}`);
        } catch (error) {
          console.error("[Publications] Failed to delete old cover image:", error);
        }
      }
    }

    // Determine new status:
    // - Admins keep existing status (or published if was published)
    // - Authors editing their own: re-submit to moderation if it was published
    const newStatus = isAdmin
      ? existing.status
      : existing.status === "published"
        ? "pending"
        : existing.status;

    // Update publication
    await ctx.db
      .update(publications)
      .set({
        ...updateData,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(publications.id, id));

    // Update tags
    if (tagIds !== undefined) {
      await ctx.db.delete(publicationTags).where(eq(publicationTags.publicationId, id));

      if (tagIds.length > 0) {
        await ctx.db.insert(publicationTags).values(
          tagIds.map((tagId) => ({
            publicationId: id,
            tagId,
          }))
        );
      }
    }

    return { success: true };
  }),

  /**
   * Delete own publication
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.db.query.publications.findFirst({
        where: eq(publications.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Публикация не найдена",
        });
      }

      if (existing.authorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Вы не можете удалить чужую публикацию",
        });
      }

      // Delete cover image from S3 if it exists
      if (existing.coverImage) {
        try {
          await deleteImage(existing.coverImage);
          console.log(`[Publications] Deleted cover image from S3: ${existing.coverImage}`);
        } catch (error) {
          console.error("[Publications] Failed to delete cover image from S3:", error);
        }
      }

      await ctx.db.delete(publications).where(eq(publications.id, input.id));

      return { success: true };
    }),

  /**
   * Submit draft for moderation
   */
  submit: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.db.query.publications.findFirst({
        where: eq(publications.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Публикация не найдена",
        });
      }

      if (existing.authorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Вы не можете отправить чужую публикацию",
        });
      }

      if (existing.status !== "draft") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Только черновики можно отправить на модерацию",
        });
      }

      await ctx.db
        .update(publications)
        .set({ status: "pending", updatedAt: new Date() })
        .where(eq(publications.id, input.id));

      return { success: true };
    }),

  // ==================== Public Procedures ====================

  /**
   * List published publications (public feed)
   */
  list: publicProcedure
    .input(
      z.object({
        type: publicationTypeSchema.optional(),
        buildingId: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, type, buildingId } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(publications.status, "published")];
      if (type) {
        conditions.push(eq(publications.type, type));
      }
      if (buildingId) {
        conditions.push(
          or(eq(publications.buildingId, buildingId), sql`${publications.buildingId} IS NULL`)!
        );
      }

      const items = await ctx.db.query.publications.findMany({
        where: and(...conditions),
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          building: true,
          publicationTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: [desc(publications.isPinned), desc(publications.createdAt)],
        limit,
        offset,
      });

      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(and(...conditions));

      return {
        items,
        total: totalResult?.count ?? 0,
        page,
        totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
      };
    }),

  /**
   * Get latest publications (for homepage widget)
   * Returns announcements, discussions, questions, etc. (not events)
   */
  latest: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(4),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const items = await ctx.db.query.publications.findMany({
        where: and(
          eq(publications.status, "published"),
          ne(publications.type, "event"),
          or(isNull(publications.publishAt), lte(publications.publishAt, now))
        ),
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          building: true,
        },
        orderBy: [desc(publications.isPinned), desc(publications.createdAt)],
        limit: input.limit,
      });

      return items;
    }),

  /**
   * Get upcoming events (for homepage widget)
   * Returns events that haven't ended yet, sorted by start date
   */
  upcomingEvents: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(4),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const items = await ctx.db.query.publications.findMany({
        where: and(
          eq(publications.status, "published"),
          eq(publications.type, "event"),
          // Only if published (publishAt is null or in the past)
          or(isNull(publications.publishAt), lte(publications.publishAt, now)),
          // Event hasn't ended yet:
          // - endAt is in the future, OR
          // - endAt is null AND startAt is in the future
          or(
            gte(publications.eventEndAt, now),
            and(isNull(publications.eventEndAt), gte(publications.eventStartAt, now))
          )
        ),
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          building: true,
        },
        // Sort by event start date (soonest first), then by pinned
        orderBy: [desc(publications.isPinned), publications.eventStartAt],
        limit: input.limit,
      });

      return items;
    }),

  /**
   * Get a single publication by ID
   */
  byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const publication = await ctx.db.query.publications.findFirst({
      where: eq(publications.id, input.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        building: true,
        publicationTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!publication) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Публикация не найдена",
      });
    }

    // Only published publications are publicly accessible
    if (publication.status !== "published") {
      const session = ctx.session;
      const isAuthor = session?.user?.id === publication.authorId;
      const isAdmin = session?.user?.isAdmin;

      if (!isAuthor && !isAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Публикация не найдена",
        });
      }
    }

    return publication;
  }),

  // ==================== Admin Procedures ====================

  admin: createTRPCRouter({
    /**
     * List all publications for moderation
     */
    list: adminProcedureWithFeature("content:moderate")
      .input(
        z.object({
          status: publicationStatusSchema.optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, status } = input;
        const offset = (page - 1) * limit;

        const conditions = [];
        if (status) {
          conditions.push(eq(publications.status, status));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const items = await ctx.db.query.publications.findMany({
          where: whereClause,
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            building: true,
            moderator: {
              columns: {
                id: true,
                name: true,
              },
            },
            publicationTags: {
              with: {
                tag: true,
              },
            },
          },
          orderBy: desc(publications.createdAt),
          limit,
          offset,
        });

        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(publications)
          .where(whereClause);

        return {
          items,
          total: totalResult?.count ?? 0,
          page,
          totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
      }),

    /**
     * Moderate a publication (approve/reject)
     */
    moderate: adminProcedureWithFeature("content:moderate")
      .input(
        z.object({
          id: z.string().uuid(),
          status: z.enum(["published", "rejected"]),
          comment: z.string().max(500).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.db.query.publications.findFirst({
          where: eq(publications.id, input.id),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Публикация не найдена",
          });
        }

        await ctx.db
          .update(publications)
          .set({
            status: input.status,
            moderatedBy: ctx.session.user.id,
            moderatedAt: new Date(),
            moderationComment: input.comment,
            updatedAt: new Date(),
          })
          .where(eq(publications.id, input.id));

        // Send Telegram notification
        const typeName: Record<string, string> = {
          announcement: "объявление",
          event: "мероприятие",
          help_request: "просьба о помощи",
          lost_found: "сообщение о потере/находке",
          recommendation: "рекомендация",
          poll: "опрос",
          discussion: "обсуждение",
          news: "новость",
          question: "вопрос",
        };
        const typeLabel = typeName[existing.type] ?? "публикация";

        sendTelegramNotificationAsync({
          event: "publication_moderated",
          title: input.status === "published" ? `Публикация одобрена` : `Публикация отклонена`,
          description: existing.title,
          metadata: {
            Тип: typeLabel,
            Статус: input.status === "published" ? "Опубликовано" : "Отклонено",
            ...(input.comment ? { Комментарий: input.comment } : {}),
          },
          userName: ctx.session.user.name ?? ctx.session.user.email ?? undefined,
        });

        return { success: true };
      }),

    /**
     * Toggle pin status
     */
    togglePin: adminProcedureWithFeature("content:moderate")
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.db.query.publications.findFirst({
          where: eq(publications.id, input.id),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Публикация не найдена",
          });
        }

        await ctx.db
          .update(publications)
          .set({
            isPinned: !existing.isPinned,
            updatedAt: new Date(),
          })
          .where(eq(publications.id, input.id));

        return { success: true, isPinned: !existing.isPinned };
      }),

    /**
     * Admin delete publication
     */
    delete: adminProcedureWithFeature("content:moderate")
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        // Get existing publication to check for cover image
        const existing = await ctx.db.query.publications.findFirst({
          where: eq(publications.id, input.id),
        });

        // Delete cover image from S3 if it exists
        if (existing?.coverImage) {
          try {
            await deleteImage(existing.coverImage);
            console.log(`[Publications] Admin deleted cover image from S3: ${existing.coverImage}`);
          } catch (error) {
            console.error("[Publications] Failed to delete cover image from S3:", error);
          }
        }

        await ctx.db.delete(publications).where(eq(publications.id, input.id));
        return { success: true };
      }),

    /**
     * Get moderation statistics
     */
    stats: adminProcedureWithFeature("content:moderate").query(async ({ ctx }) => {
      const [pending] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(eq(publications.status, "pending"));

      const [published] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(eq(publications.status, "published"));

      const [rejected] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(eq(publications.status, "rejected"));

      return {
        pending: pending?.count ?? 0,
        published: published?.count ?? 0,
        rejected: rejected?.count ?? 0,
        total: (pending?.count ?? 0) + (published?.count ?? 0) + (rejected?.count ?? 0),
      };
    }),

    /**
     * Get event-specific statistics
     */
    eventStats: adminProcedureWithFeature("content:moderate").query(async ({ ctx }) => {
      const now = new Date();

      // Total events
      const [total] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(eq(publications.type, "event"));

      // Pending moderation
      const [pending] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(and(eq(publications.type, "event"), eq(publications.status, "pending")));

      // Published events
      const [published] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(and(eq(publications.type, "event"), eq(publications.status, "published")));

      // Upcoming events (published, eventStartAt > now)
      const [upcoming] = await ctx.db
        .select({ count: count() })
        .from(publications)
        .where(
          and(
            eq(publications.type, "event"),
            eq(publications.status, "published"),
            gte(publications.eventStartAt, now)
          )
        );

      return {
        total: total?.count ?? 0,
        pending: pending?.count ?? 0,
        published: published?.count ?? 0,
        upcoming: upcoming?.count ?? 0,
      };
    }),
  }),
});
