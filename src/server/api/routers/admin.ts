import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { z } from "zod";

import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";
import {
  accounts,
  apartments,
  buildings,
  deletionRequests,
  entrances,
  floors,
  listings,
  parkingFloors,
  parkings,
  parkingSpots,
  sessions,
  userApartments,
  userParkingSpots,
  userProfiles,
  userRoles,
  users,
} from "~/server/db/schema";

import {
  adminProcedure,
  adminProcedureWithFeature,
  createTRPCRouter,
} from "../trpc";

// Zod schema for revocation templates
const revocationTemplateSchema = z.enum([
  "community_rules_violation",
  "role_owner_change",
  "custom",
]);

// Тексты шаблонов отзыва прав
const REVOCATION_TEMPLATES: Record<string, string> = {
  community_rules_violation: "Нарушение правил сообщества",
  role_owner_change: "Смена роли, смена владельца, изменение правового состояния",
};

// Zod schema for user role enum
const userRoleSchema = z.enum([
  "Root",
  "SuperAdmin",
  "Admin",
  "ApartmentOwner",
  "ApartmentResident",
  "ParkingOwner",
  "ParkingResident",
  "Editor",
  "Moderator",
  "Guest",
  "BuildingChairman",
  "ComplexChairman",
  "ComplexRepresenative",
  "StoreOwner",
  "StoreRepresenative",
]);

export const adminRouter = createTRPCRouter({
  // Get paginated list of users
  users: createTRPCRouter({
    list: adminProcedureWithFeature("users:view")
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          search: z.string().optional(),
          roleFilter: userRoleSchema.optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, search, roleFilter } = input;
        const offset = (page - 1) * limit;

        // Build where conditions
        const searchCondition = search
          ? or(
              ilike(users.name, `%${search}%`),
              ilike(users.email, `%${search}%`),
            )
          : undefined;

        // Get users with pagination
        const usersQuery = ctx.db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(searchCondition)
          .limit(limit)
          .offset(offset);

        const usersResult = await usersQuery;

        // Get total count
        const totalResult = await ctx.db
          .select({ count: count() })
          .from(users)
          .where(searchCondition);
        const total = totalResult[0]?.count ?? 0;

        // Get roles for each user
        const userIds = usersResult.map((u) => u.id);
        const rolesResult =
          userIds.length > 0
            ? await ctx.db
                .select({
                  userId: userRoles.userId,
                  role: userRoles.role,
                })
                .from(userRoles)
                .where(
                  or(...userIds.map((id) => eq(userRoles.userId, id))) ??
                    undefined,
                )
            : [];

        // Group roles by user
        const rolesByUser = rolesResult.reduce(
          (acc, { userId, role }) => {
            if (!acc[userId]) acc[userId] = [];
            acc[userId].push(role as UserRole);
            return acc;
          },
          {} as Record<string, UserRole[]>,
        );

        // Filter by role if specified
        let filteredUsers = usersResult.map((user) => ({
          ...user,
          roles: rolesByUser[user.id] ?? [],
        }));

        if (roleFilter) {
          filteredUsers = filteredUsers.filter((user) =>
            user.roles.includes(roleFilter),
          );
        }

        return {
          users: filteredUsers,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }),

    // Get single user by ID
    getById: adminProcedureWithFeature("users:view")
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.userId),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const roles = await ctx.db
          .select({ role: userRoles.role })
          .from(userRoles)
          .where(eq(userRoles.userId, input.userId));

        return {
          ...user,
          roles: roles.map((r) => r.role as UserRole),
        };
      }),

    // Update user roles
    updateRoles: adminProcedureWithFeature("users:roles")
      .input(
        z.object({
          userId: z.string().uuid(),
          roles: z.array(userRoleSchema),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { userId, roles: newRoles } = input;

        // Verify user exists
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if current user can assign these roles
        // Root can assign any role, SuperAdmin can assign non-Root roles
        const currentUserRoles = ctx.userRoles;
        const isRoot = currentUserRoles.includes("Root");
        const isSuperAdmin = currentUserRoles.includes("SuperAdmin");

        if (!isRoot && newRoles.includes("Root")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only Root can assign Root role",
          });
        }

        if (!isRoot && !isSuperAdmin && newRoles.includes("SuperAdmin")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only Root or SuperAdmin can assign SuperAdmin role",
          });
        }

        // Delete existing roles
        await ctx.db.delete(userRoles).where(eq(userRoles.userId, userId));

        // Insert new roles
        if (newRoles.length > 0) {
          await ctx.db.insert(userRoles).values(
            newRoles.map((role) => ({
              userId,
              role,
            })),
          );
        }

        return { success: true };
      }),

    // Delete user
    delete: adminProcedureWithFeature("users:delete")
      .input(z.object({ userId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;

        // Prevent self-deletion
        if (userId === ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot delete yourself",
          });
        }

        // Verify user exists
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if target user is Root (cannot be deleted)
        const targetRoles = await ctx.db
          .select({ role: userRoles.role })
          .from(userRoles)
          .where(eq(userRoles.userId, userId));

        if (targetRoles.some((r) => r.role === "Root")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot delete Root user",
          });
        }

        // Delete user (cascades to roles, sessions, etc.)
        await ctx.db.delete(users).where(eq(users.id, userId));

        return { success: true };
      }),

    // Get user's property bindings (apartments and parking spots)
    getProperties: adminProcedureWithFeature("users:view")
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { userId } = input;

        // Get apartment bindings (only non-revoked ones)
        const apartmentBindings = await ctx.db.query.userApartments.findMany({
          where: and(
            eq(userApartments.userId, userId),
            isNull(userApartments.revokedAt)
          ),
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
          },
        });

        // Get parking bindings (only non-revoked ones)
        const parkingBindings = await ctx.db.query.userParkingSpots.findMany({
          where: and(
            eq(userParkingSpots.userId, userId),
            isNull(userParkingSpots.revokedAt)
          ),
          with: {
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
          },
        });

        return {
          apartments: apartmentBindings,
          parkingSpots: parkingBindings,
        };
      }),

    // Revoke apartment binding
    revokeApartment: adminProcedureWithFeature("users:roles")
      .input(
        z.object({
          userId: z.string().uuid(),
          apartmentId: z.string(),
          revocationTemplate: revocationTemplateSchema,
          customReason: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { userId, apartmentId, revocationTemplate, customReason } = input;

        // Check if binding exists
        const binding = await ctx.db.query.userApartments.findFirst({
          where: and(
            eq(userApartments.userId, userId),
            eq(userApartments.apartmentId, apartmentId),
            isNull(userApartments.revokedAt)
          ),
        });

        if (!binding) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Привязка не найдена",
          });
        }

        // Determine revocation reason text
        const revocationReason =
          revocationTemplate === "custom"
            ? customReason ?? ""
            : REVOCATION_TEMPLATES[revocationTemplate] ?? "";

        // Soft-delete the binding
        await ctx.db
          .update(userApartments)
          .set({
            revokedAt: new Date(),
            revokedBy: ctx.session.user.id,
            revocationTemplate,
            revocationReason,
          })
          .where(
            and(
              eq(userApartments.userId, userId),
              eq(userApartments.apartmentId, apartmentId)
            )
          );

        // Archive related listings for this apartment
        await ctx.db
          .update(listings)
          .set({
            status: "archived",
            archiveReason: "rights_revoked",
            archivedComment: `Отзыв прав на собственность: ${revocationReason}`,
            archivedBy: ctx.session.user.id,
            archivedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(listings.userId, userId),
              eq(listings.apartmentId, apartmentId),
              or(
                eq(listings.status, "draft"),
                eq(listings.status, "pending_moderation"),
                eq(listings.status, "approved")
              )
            )
          );

        return { success: true };
      }),

    // Revoke parking spot binding
    revokeParkingSpot: adminProcedureWithFeature("users:roles")
      .input(
        z.object({
          userId: z.string().uuid(),
          parkingSpotId: z.string(),
          revocationTemplate: revocationTemplateSchema,
          customReason: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { userId, parkingSpotId, revocationTemplate, customReason } = input;

        // Check if binding exists
        const binding = await ctx.db.query.userParkingSpots.findFirst({
          where: and(
            eq(userParkingSpots.userId, userId),
            eq(userParkingSpots.parkingSpotId, parkingSpotId),
            isNull(userParkingSpots.revokedAt)
          ),
        });

        if (!binding) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Привязка не найдена",
          });
        }

        // Determine revocation reason text
        const revocationReason =
          revocationTemplate === "custom"
            ? customReason ?? ""
            : REVOCATION_TEMPLATES[revocationTemplate] ?? "";

        // Soft-delete the binding
        await ctx.db
          .update(userParkingSpots)
          .set({
            revokedAt: new Date(),
            revokedBy: ctx.session.user.id,
            revocationTemplate,
            revocationReason,
          })
          .where(
            and(
              eq(userParkingSpots.userId, userId),
              eq(userParkingSpots.parkingSpotId, parkingSpotId)
            )
          );

        // Archive related listings for this parking spot
        await ctx.db
          .update(listings)
          .set({
            status: "archived",
            archiveReason: "rights_revoked",
            archivedComment: `Отзыв прав на собственность: ${revocationReason}`,
            archivedBy: ctx.session.user.id,
            archivedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(listings.userId, userId),
              eq(listings.parkingSpotId, parkingSpotId),
              or(
                eq(listings.status, "draft"),
                eq(listings.status, "pending_moderation"),
                eq(listings.status, "approved")
              )
            )
          );

        return { success: true };
      }),

    // Get revocation history for user
    getRevocationHistory: adminProcedureWithFeature("users:view")
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { userId } = input;

        // Get revoked apartment bindings
        const revokedApartments = await ctx.db.query.userApartments.findMany({
          where: and(
            eq(userApartments.userId, userId),
            eq(userApartments.revokedAt, userApartments.revokedAt) // not null check hack
          ),
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
            revokedByUser: true,
          },
        });

        // Get revoked parking bindings
        const revokedParkings = await ctx.db.query.userParkingSpots.findMany({
          where: and(
            eq(userParkingSpots.userId, userId),
            eq(userParkingSpots.revokedAt, userParkingSpots.revokedAt) // not null check hack
          ),
          with: {
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
            revokedByUser: true,
          },
        });

        // Filter only those that have revokedAt set
        return {
          apartments: revokedApartments.filter((a) => a.revokedAt !== null),
          parkingSpots: revokedParkings.filter((p) => p.revokedAt !== null),
        };
      }),
  }),

  // Buildings management
  buildings: createTRPCRouter({
    // Get all buildings with full hierarchy
    list: adminProcedureWithFeature("buildings:view").query(async ({ ctx }) => {
      const buildingsData = await ctx.db.query.buildings.findMany({
        with: {
          entrances: {
            with: {
              floors: {
                with: {
                  apartments: true,
                },
                orderBy: (floors, { asc }) => [asc(floors.floorNumber)],
              },
            },
            orderBy: (entrances, { asc }) => [asc(entrances.entranceNumber)],
          },
          parkings: {
            with: {
              floors: {
                with: {
                  spots: true,
                },
                orderBy: (floors, { asc }) => [asc(floors.floorNumber)],
              },
            },
          },
        },
        orderBy: (buildings, { asc }) => [asc(buildings.number)],
      });

      return buildingsData;
    }),

    // Get single building by ID
    getById: adminProcedureWithFeature("buildings:view")
      .input(z.object({ buildingId: z.string() }))
      .query(async ({ ctx, input }) => {
        const building = await ctx.db.query.buildings.findFirst({
          where: eq(buildings.id, input.buildingId),
          with: {
            entrances: {
              with: {
                floors: {
                  with: {
                    apartments: true,
                  },
                  orderBy: (floors, { asc }) => [asc(floors.floorNumber)],
                },
              },
              orderBy: (entrances, { asc }) => [asc(entrances.entranceNumber)],
            },
            parkings: {
              with: {
                floors: {
                  with: {
                    spots: true,
                  },
                  orderBy: (floors, { asc }) => [asc(floors.floorNumber)],
                },
              },
            },
          },
        });

        if (!building) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Building not found",
          });
        }

        return building;
      }),

    // Get stats for buildings
    stats: adminProcedureWithFeature("buildings:view").query(async ({ ctx }) => {
      const [buildingsCount] = await ctx.db.select({ count: count() }).from(buildings);
      const [entrancesCount] = await ctx.db.select({ count: count() }).from(entrances);
      const [floorsCount] = await ctx.db.select({ count: count() }).from(floors);
      const [apartmentsCount] = await ctx.db.select({ count: count() }).from(apartments);
      const [parkingsCount] = await ctx.db.select({ count: count() }).from(parkings);
      const [parkingSpotsCount] = await ctx.db.select({ count: count() }).from(parkingSpots);

      return {
        buildings: buildingsCount?.count ?? 0,
        entrances: entrancesCount?.count ?? 0,
        floors: floorsCount?.count ?? 0,
        apartments: apartmentsCount?.count ?? 0,
        parkings: parkingsCount?.count ?? 0,
        parkingSpots: parkingSpotsCount?.count ?? 0,
      };
    }),
  }),

  // Get dashboard stats
  stats: adminProcedure.query(async ({ ctx }) => {
    const usersCount = await ctx.db.select({ count: count() }).from(users);

    return {
      totalUsers: usersCount[0]?.count ?? 0,
    };
  }),

  // Deletion requests management
  deletionRequests: createTRPCRouter({
    // List all deletion requests
    list: adminProcedureWithFeature("users:delete")
      .input(
        z.object({
          status: z
            .enum(["pending", "approved", "rejected", "completed"])
            .optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { status } = input;

        const requests = await ctx.db.query.deletionRequests.findMany({
          where: status ? eq(deletionRequests.status, status) : undefined,
          with: {
            user: true,
          },
          orderBy: [desc(deletionRequests.createdAt)],
        });

        return requests;
      }),

    // Approve deletion request
    approve: adminProcedureWithFeature("users:delete")
      .input(
        z.object({
          requestId: z.string().uuid(),
          adminNotes: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { requestId, adminNotes } = input;

        const request = await ctx.db.query.deletionRequests.findFirst({
          where: eq(deletionRequests.id, requestId),
        });

        if (!request) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Заявка не найдена",
          });
        }

        if (request.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Заявка уже обработана",
          });
        }

        // Update request status
        await ctx.db
          .update(deletionRequests)
          .set({
            status: "approved",
            adminNotes,
            processedBy: ctx.session.user.id,
            processedAt: new Date(),
          })
          .where(eq(deletionRequests.id, requestId));

        return { success: true };
      }),

    // Reject deletion request
    reject: adminProcedureWithFeature("users:delete")
      .input(
        z.object({
          requestId: z.string().uuid(),
          adminNotes: z.string().max(1000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { requestId, adminNotes } = input;

        const request = await ctx.db.query.deletionRequests.findFirst({
          where: eq(deletionRequests.id, requestId),
        });

        if (!request) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Заявка не найдена",
          });
        }

        if (request.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Заявка уже обработана",
          });
        }

        // Update request status
        await ctx.db
          .update(deletionRequests)
          .set({
            status: "rejected",
            adminNotes,
            processedBy: ctx.session.user.id,
            processedAt: new Date(),
          })
          .where(eq(deletionRequests.id, requestId));

        return { success: true };
      }),

    // Create deletion request (by admin for a user)
    create: adminProcedureWithFeature("users:delete")
      .input(
        z.object({
          userId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { userId, reason } = input;

        // Prevent self-deletion request
        if (userId === ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Нельзя создать заявку на удаление своего аккаунта",
          });
        }

        // Check if user exists
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Пользователь не найден",
          });
        }

        // Check if user is Root (cannot be deleted)
        const targetRoles = await ctx.db
          .select({ role: userRoles.role })
          .from(userRoles)
          .where(eq(userRoles.userId, userId));

        if (targetRoles.some((r) => r.role === "Root")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Невозможно удалить Root пользователя",
          });
        }

        // Check if there's already a pending request for this user
        const existingRequest = await ctx.db.query.deletionRequests.findFirst({
          where: and(
            eq(deletionRequests.userId, userId),
            eq(deletionRequests.status, "pending")
          ),
        });

        if (existingRequest) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Уже существует заявка на удаление этого пользователя",
          });
        }

        // Create deletion request
        const [request] = await ctx.db
          .insert(deletionRequests)
          .values({
            userId,
            reason: reason ?? "Удаление по решению администрации",
          })
          .returning();

        return request;
      }),

    // Execute approved deletion (soft delete user)
    execute: adminProcedureWithFeature("users:delete")
      .input(
        z.object({
          requestId: z.string().uuid(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { requestId } = input;

        const request = await ctx.db.query.deletionRequests.findFirst({
          where: eq(deletionRequests.id, requestId),
        });

        if (!request) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Заявка не найдена",
          });
        }

        if (request.status !== "approved") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Заявка должна быть сначала одобрена",
          });
        }

        const userId = request.userId;

        // Check if user is Root (cannot be deleted)
        const targetRoles = await ctx.db
          .select({ role: userRoles.role })
          .from(userRoles)
          .where(eq(userRoles.userId, userId));

        if (targetRoles.some((r) => r.role === "Root")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Невозможно удалить Root пользователя",
          });
        }

        // Soft delete: mark user as deleted, remove personal data
        await ctx.db
          .update(users)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
            name: "[Удалён]",
            email: `deleted_${userId}@deleted.local`,
            image: null,
          })
          .where(eq(users.id, userId));

        // Delete user profile (personal data)
        await ctx.db
          .delete(userProfiles)
          .where(eq(userProfiles.userId, userId));

        // Delete accounts (OAuth connections)
        await ctx.db.delete(accounts).where(eq(accounts.userId, userId));

        // Delete sessions
        await ctx.db.delete(sessions).where(eq(sessions.userId, userId));

        // Delete roles
        await ctx.db.delete(userRoles).where(eq(userRoles.userId, userId));

        // Revoke all property bindings
        await ctx.db
          .update(userApartments)
          .set({
            revokedAt: new Date(),
            revokedBy: ctx.session.user.id,
            revocationReason: "Удаление аккаунта пользователя",
          })
          .where(
            and(
              eq(userApartments.userId, userId),
              isNull(userApartments.revokedAt)
            )
          );

        await ctx.db
          .update(userParkingSpots)
          .set({
            revokedAt: new Date(),
            revokedBy: ctx.session.user.id,
            revocationReason: "Удаление аккаунта пользователя",
          })
          .where(
            and(
              eq(userParkingSpots.userId, userId),
              isNull(userParkingSpots.revokedAt)
            )
          );

        // Archive all listings
        await ctx.db
          .update(listings)
          .set({
            status: "archived",
            archiveReason: "admin",
            archivedComment: "Удаление аккаунта пользователя",
            archivedBy: ctx.session.user.id,
            archivedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(listings.userId, userId),
              or(
                eq(listings.status, "draft"),
                eq(listings.status, "pending_moderation"),
                eq(listings.status, "approved")
              )
            )
          );

        // Mark deletion request as completed
        await ctx.db
          .update(deletionRequests)
          .set({
            status: "completed",
            processedAt: new Date(),
          })
          .where(eq(deletionRequests.id, requestId));

        return { success: true };
      }),
  }),
});
