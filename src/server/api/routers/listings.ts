import { TRPCError } from "@trpc/server";
import { and, eq, desc, count, or } from "drizzle-orm";
import { z } from "zod";

import {
  listings,
  listingPhotos,
  userApartments,
  userParkingSpots,
} from "~/server/db/schema";

import {
  adminProcedureWithFeature,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

// Zod schemas
const listingTypeSchema = z.enum(["rent", "sale"]);
const propertyTypeSchema = z.enum(["apartment", "parking"]);
const listingStatusSchema = z.enum([
  "draft",
  "pending_moderation",
  "approved",
  "rejected",
  "archived",
]);

export const listingsRouter = createTRPCRouter({
  // Get current user's listings
  my: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userListings = await ctx.db.query.listings.findMany({
      where: eq(listings.userId, userId),
      with: {
        apartment: {
          with: {
            floor: {
              with: {
                entrance: {
                  with: {
                    building: true,
                  },
                },
              },
            },
          },
        },
        parkingSpot: {
          with: {
            floor: {
              with: {
                parking: {
                  with: {
                    building: true,
                  },
                },
              },
            },
          },
        },
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
        },
      },
      orderBy: desc(listings.createdAt),
    });

    return userListings;
  }),

  // Get user's verified properties (can be used for listings)
  myProperties: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get apartments where user is owner
    const myApartments = await ctx.db.query.userApartments.findMany({
      where: and(
        eq(userApartments.userId, userId),
        eq(userApartments.status, "approved"),
        or(
          eq(userApartments.role, "ApartmentOwner"),
          eq(userApartments.role, "ParkingOwner")
        )
      ),
      with: {
        apartment: {
          with: {
            floor: {
              with: {
                entrance: {
                  with: {
                    building: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get parking spots where user is owner
    const myParkingSpots = await ctx.db.query.userParkingSpots.findMany({
      where: and(
        eq(userParkingSpots.userId, userId),
        eq(userParkingSpots.status, "approved"),
        eq(userParkingSpots.role, "ParkingOwner")
      ),
      with: {
        parkingSpot: {
          with: {
            floor: {
              with: {
                parking: {
                  with: {
                    building: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      apartments: myApartments.map((ua) => ua.apartment),
      parkingSpots: myParkingSpots.map((up) => up.parkingSpot),
    };
  }),

  // Create a new listing
  create: protectedProcedure
    .input(
      z.object({
        listingType: listingTypeSchema,
        propertyType: propertyTypeSchema,
        apartmentId: z.string().optional(),
        parkingSpotId: z.string().optional(),
        title: z.string().min(5).max(255),
        description: z.string().max(5000).optional(),
        price: z.number().min(1),
        utilitiesIncluded: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Validate property ownership
      if (input.propertyType === "apartment") {
        if (!input.apartmentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Apartment ID is required",
          });
        }

        // Check if user owns this apartment
        const ownership = await ctx.db.query.userApartments.findFirst({
          where: and(
            eq(userApartments.userId, userId),
            eq(userApartments.apartmentId, input.apartmentId),
            eq(userApartments.status, "approved"),
            eq(userApartments.role, "ApartmentOwner")
          ),
        });

        if (!ownership) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Вы должны быть подтвержденным собственником квартиры",
          });
        }
      } else if (input.propertyType === "parking") {
        if (!input.parkingSpotId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Parking spot ID is required",
          });
        }

        // Check if user owns this parking spot
        const ownership = await ctx.db.query.userParkingSpots.findFirst({
          where: and(
            eq(userParkingSpots.userId, userId),
            eq(userParkingSpots.parkingSpotId, input.parkingSpotId),
            eq(userParkingSpots.status, "approved"),
            eq(userParkingSpots.role, "ParkingOwner")
          ),
        });

        if (!ownership) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Вы должны быть подтвержденным собственником парковки",
          });
        }
      }

      // Create listing
      const [listing] = await ctx.db
        .insert(listings)
        .values({
          userId,
          listingType: input.listingType,
          propertyType: input.propertyType,
          apartmentId: input.apartmentId,
          parkingSpotId: input.parkingSpotId,
          title: input.title,
          description: input.description,
          price: input.price,
          utilitiesIncluded: input.utilitiesIncluded,
          status: "draft",
        })
        .returning();

      return listing;
    }),

  // Update listing
  update: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        title: z.string().min(5).max(255).optional(),
        description: z.string().max(5000).optional(),
        price: z.number().min(1).optional(),
        utilitiesIncluded: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listing = await ctx.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.userId, userId)
        ),
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Объявление не найдено",
        });
      }

      // Can only update drafts or rejected listings
      if (!["draft", "rejected"].includes(listing.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Можно редактировать только черновики или отклоненные объявления",
        });
      }

      await ctx.db
        .update(listings)
        .set({
          title: input.title ?? listing.title,
          description: input.description ?? listing.description,
          price: input.price ?? listing.price,
          utilitiesIncluded: input.utilitiesIncluded ?? listing.utilitiesIncluded,
          updatedAt: new Date(),
        })
        .where(eq(listings.id, input.listingId));

      return { success: true };
    }),

  // Submit for moderation
  submitForModeration: protectedProcedure
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listing = await ctx.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.userId, userId)
        ),
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Объявление не найдено",
        });
      }

      if (!["draft", "rejected"].includes(listing.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Можно отправить на модерацию только черновики",
        });
      }

      await ctx.db
        .update(listings)
        .set({
          status: "pending_moderation",
          updatedAt: new Date(),
        })
        .where(eq(listings.id, input.listingId));

      return { success: true };
    }),

  // Archive listing
  archive: protectedProcedure
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listing = await ctx.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.userId, userId)
        ),
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Объявление не найдено",
        });
      }

      await ctx.db
        .update(listings)
        .set({
          status: "archived",
          updatedAt: new Date(),
        })
        .where(eq(listings.id, input.listingId));

      return { success: true };
    }),

  // Delete listing (only drafts)
  delete: protectedProcedure
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listing = await ctx.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.userId, userId)
        ),
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Объявление не найдено",
        });
      }

      if (listing.status !== "draft") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Можно удалить только черновики",
        });
      }

      await ctx.db.delete(listings).where(eq(listings.id, input.listingId));

      return { success: true };
    }),

  // Add photo (placeholder - storage not implemented)
  addPhoto: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        url: z.string().url(),
        isMain: z.boolean().default(false),
        altText: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listing = await ctx.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.userId, userId)
        ),
        with: { photos: true },
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Объявление не найдено",
        });
      }

      // Check photo limit (max 20)
      if (listing.photos.length >= 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Максимум 20 фотографий на объявление",
        });
      }

      const sortOrder = listing.photos.length;

      // If this is the first photo or isMain is true, make it the main photo
      const shouldBeMain = input.isMain || listing.photos.length === 0;

      // If setting as main, unset other main photos
      if (shouldBeMain && listing.photos.length > 0) {
        await ctx.db
          .update(listingPhotos)
          .set({ isMain: false })
          .where(eq(listingPhotos.listingId, input.listingId));
      }

      const [photo] = await ctx.db
        .insert(listingPhotos)
        .values({
          listingId: input.listingId,
          url: input.url,
          sortOrder,
          isMain: shouldBeMain,
          altText: input.altText,
        })
        .returning();

      return photo;
    }),

  // Admin: list all listings for moderation
  admin: createTRPCRouter({
    list: adminProcedureWithFeature("listings:view")
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          status: listingStatusSchema.optional(),
          type: listingTypeSchema.optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, status, type } = input;
        const offset = (page - 1) * limit;

        const conditions = [];
        if (status) {
          conditions.push(eq(listings.status, status));
        }
        if (type) {
          conditions.push(eq(listings.listingType, type));
        }

        const whereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        const listingsData = await ctx.db.query.listings.findMany({
          where: whereClause,
          with: {
            user: true,
            apartment: {
              with: {
                floor: {
                  with: {
                    entrance: {
                      with: { building: true },
                    },
                  },
                },
              },
            },
            parkingSpot: {
              with: {
                floor: {
                  with: {
                    parking: {
                      with: { building: true },
                    },
                  },
                },
              },
            },
            photos: {
              orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
            },
          },
          orderBy: desc(listings.createdAt),
          limit,
          offset,
        });

        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(listings)
          .where(whereClause);

        return {
          listings: listingsData,
          total: totalResult?.count ?? 0,
          page,
          totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
      }),

    // Moderate listing
    moderate: adminProcedureWithFeature("listings:moderate")
      .input(
        z.object({
          listingId: z.string(),
          status: z.enum(["approved", "rejected"]),
          rejectionReason: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const listing = await ctx.db.query.listings.findFirst({
          where: eq(listings.id, input.listingId),
        });

        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Объявление не найдено",
          });
        }

        if (listing.status !== "pending_moderation") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Объявление не на модерации",
          });
        }

        await ctx.db
          .update(listings)
          .set({
            status: input.status,
            rejectionReason:
              input.status === "rejected" ? input.rejectionReason : null,
            moderatedBy: ctx.session.user.id,
            moderatedAt: new Date(),
            publishedAt: input.status === "approved" ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(listings.id, input.listingId));

        return { success: true };
      }),

    // Get moderation stats
    stats: adminProcedureWithFeature("listings:view").query(async ({ ctx }) => {
      const [pending] = await ctx.db
        .select({ count: count() })
        .from(listings)
        .where(eq(listings.status, "pending_moderation"));

      const [approved] = await ctx.db
        .select({ count: count() })
        .from(listings)
        .where(eq(listings.status, "approved"));

      const [rejected] = await ctx.db
        .select({ count: count() })
        .from(listings)
        .where(eq(listings.status, "rejected"));

      return {
        pendingModeration: pending?.count ?? 0,
        approved: approved?.count ?? 0,
        rejected: rejected?.count ?? 0,
      };
    }),
  }),

  // Public: get approved listings (for browsing)
  public: createTRPCRouter({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(20),
          type: listingTypeSchema.optional(),
          propertyType: propertyTypeSchema.optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, type, propertyType } = input;
        const offset = (page - 1) * limit;

        const conditions = [eq(listings.status, "approved")];
        if (type) {
          conditions.push(eq(listings.listingType, type));
        }
        if (propertyType) {
          conditions.push(eq(listings.propertyType, propertyType));
        }

        const whereClause = and(...conditions);

        const listingsData = await ctx.db.query.listings.findMany({
          where: whereClause,
          with: {
            apartment: {
              with: {
                floor: {
                  with: {
                    entrance: {
                      with: { building: true },
                    },
                  },
                },
              },
            },
            parkingSpot: {
              with: {
                floor: {
                  with: {
                    parking: {
                      with: { building: true },
                    },
                  },
                },
              },
            },
            photos: {
              orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
            },
          },
          orderBy: desc(listings.publishedAt),
          limit,
          offset,
        });

        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(listings)
          .where(whereClause);

        return {
          listings: listingsData,
          total: totalResult?.count ?? 0,
          page,
          totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
      }),
  }),
});
