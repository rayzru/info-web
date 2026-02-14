import { and, eq } from "drizzle-orm";
import { z } from "zod";

import type { UserRole } from "~/server/auth/rbac";
import {
  buildings,
  deletionRequests,
  userInterestBuildings,
  userProfiles,
  userRoles,
  users,
} from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Helper to generate tagline from user roles
export function generateTaglineFromRoles(roles: UserRole[]): string | null {
  // Priority order for role-based taglines
  const rolePriority: Record<string, string> = {
    Root: "Администратор",
    SuperAdmin: "Администратор",
    Admin: "Администратор",
    ComplexChairman: "Председатель комплекса",
    BuildingChairman: "Председатель дома",
    ComplexRepresenative: "Представитель УК",
    StoreOwner: "Владелец магазина",
    StoreRepresenative: "Представитель магазина",
    Editor: "Редактор",
    Moderator: "Модератор",
    ApartmentOwner: "Собственник",
    ParkingOwner: "Собственник",
    ApartmentResident: "Жилец",
    ParkingResident: "Арендатор",
  };

  for (const [role, tagline] of Object.entries(rolePriority)) {
    if (roles.includes(role as UserRole)) {
      return tagline;
    }
  }

  return null;
}

// Zod schema for gender enum
const genderSchema = z.enum(["Male", "Female", "Unspecified"]);

// Zod schema for map provider enum
const mapProviderSchema = z.enum(["yandex", "2gis", "google", "apple", "osm"]);

export const profileRouter = createTRPCRouter({
  // Get current user's profile
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user and profile data
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const profile = await ctx.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    // Get user roles
    const roles = await ctx.db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
    });

    const userRolesList = roles.map((r) => r.role);

    // Compute effective tagline
    const effectiveTagline = profile?.tagline ?? generateTaglineFromRoles(userRolesList);

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
        roles: userRolesList.length > 0 ? userRolesList : (["Guest"] as UserRole[]),
      },
      profile: profile ?? null,
      // Computed tagline (either custom or auto-generated from roles)
      effectiveTagline,
      // Whether tagline was set by admin (user cannot edit)
      taglineSetByAdmin: profile?.taglineSetByAdmin ?? false,
    };
  }),

  // Update profile
  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(255).optional(),
        firstName: z.string().max(255).optional(),
        lastName: z.string().max(255).optional(),
        middleName: z.string().max(255).optional(),
        phone: z
          .string()
          .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
          .optional()
          .nullable(),
        gender: genderSchema.optional().nullable(),
        dateOfBirth: z.date().optional().nullable(),
        hidePhone: z.boolean().optional(),
        hideName: z.boolean().optional(),
        hideGender: z.boolean().optional(),
        hideBirthday: z.boolean().optional(),
        // Мессенджеры
        telegramUsername: z
          .string()
          .max(100)
          .regex(/^[a-zA-Z0-9_]{5,32}$/, "Некорректный username Telegram")
          .optional()
          .nullable(),
        maxUsername: z.string().max(100).optional().nullable(),
        whatsappPhone: z
          .string()
          .regex(/^\+?[1-9]\d{1,14}$/, "Некорректный номер WhatsApp")
          .optional()
          .nullable(),
        hideMessengers: z.boolean().optional(),
        // Настройки приложения
        mapProvider: mapProviderSchema.optional().nullable(),
        // Подпись профиля
        tagline: z.string().max(100).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if profile exists
      const existingProfile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      });

      if (existingProfile) {
        // Only update tagline if not set by admin
        const taglineUpdate = existingProfile.taglineSetByAdmin ? {} : { tagline: input.tagline };

        // Update existing profile
        await ctx.db
          .update(userProfiles)
          .set({
            displayName: input.displayName,
            firstName: input.firstName,
            lastName: input.lastName,
            middleName: input.middleName,
            phone: input.phone,
            gender: input.gender,
            dateOfBirth: input.dateOfBirth,
            hidePhone: input.hidePhone,
            hideName: input.hideName,
            hideGender: input.hideGender,
            hideBirthday: input.hideBirthday,
            // Мессенджеры
            telegramUsername: input.telegramUsername,
            maxUsername: input.maxUsername,
            whatsappPhone: input.whatsappPhone,
            hideMessengers: input.hideMessengers,
            // Настройки приложения
            mapProvider: input.mapProvider,
            // Подпись профиля (если не установлена администратором)
            ...taglineUpdate,
          })
          .where(eq(userProfiles.id, existingProfile.id));
      } else {
        // Create new profile
        await ctx.db.insert(userProfiles).values({
          userId,
          displayName: input.displayName,
          firstName: input.firstName,
          lastName: input.lastName,
          middleName: input.middleName,
          phone: input.phone,
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
          hidePhone: input.hidePhone ?? false,
          hideName: input.hideName ?? false,
          hideGender: input.hideGender ?? false,
          hideBirthday: input.hideBirthday ?? false,
          // Мессенджеры
          telegramUsername: input.telegramUsername,
          maxUsername: input.maxUsername,
          whatsappPhone: input.whatsappPhone,
          hideMessengers: input.hideMessengers ?? false,
          // Настройки приложения
          mapProvider: input.mapProvider ?? "yandex",
          // Подпись профиля
          tagline: input.tagline,
        });
      }

      return { success: true };
    }),

  // Update avatar (placeholder - returns not implemented)
  updateAvatar: protectedProcedure
    .input(
      z.object({
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async () => {
      // Placeholder - storage not yet implemented
      return {
        success: false,
        message: "Загрузка аватарки пока недоступна. Функция в разработке.",
      };
    }),

  // Get pending deletion request for current user
  getDeletionRequest: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const request = await ctx.db.query.deletionRequests.findFirst({
      where: and(eq(deletionRequests.userId, userId), eq(deletionRequests.status, "pending")),
    });

    return request ?? null;
  }),

  // Request account deletion
  requestDeletion: protectedProcedure
    .input(
      z.object({
        reason: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if there's already a pending request
      const existingRequest = await ctx.db.query.deletionRequests.findFirst({
        where: and(eq(deletionRequests.userId, userId), eq(deletionRequests.status, "pending")),
      });

      if (existingRequest) {
        return {
          success: false,
          message: "У вас уже есть активная заявка на удаление аккаунта.",
        };
      }

      // Create new deletion request
      await ctx.db.insert(deletionRequests).values({
        userId,
        reason: input.reason,
        status: "pending",
      });

      return {
        success: true,
        message:
          "Заявка на удаление аккаунта отправлена. Администрация рассмотрит её в течение 30 дней.",
      };
    }),

  // Cancel deletion request
  cancelDeletionRequest: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Find pending request
    const request = await ctx.db.query.deletionRequests.findFirst({
      where: and(eq(deletionRequests.userId, userId), eq(deletionRequests.status, "pending")),
    });

    if (!request) {
      return {
        success: false,
        message: "Активная заявка на удаление не найдена.",
      };
    }

    // Delete the request (or mark as cancelled)
    await ctx.db.delete(deletionRequests).where(eq(deletionRequests.id, request.id));

    return {
      success: true,
      message: "Заявка на удаление аккаунта отменена.",
    };
  }),

  // ============================================================================
  // Interest Buildings (область интересов - строения)
  // ============================================================================

  // Get user's interest buildings
  getInterestBuildings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const interests = await ctx.db.query.userInterestBuildings.findMany({
      where: eq(userInterestBuildings.userId, userId),
      with: {
        building: true,
      },
      orderBy: (t, { asc }) => [asc(t.createdAt)],
    });

    return interests.map((i) => ({
      buildingId: i.buildingId,
      buildingNumber: i.building.number,
      buildingTitle: i.building.title,
      autoAdded: i.autoAdded,
      createdAt: i.createdAt,
    }));
  }),

  // Add building to interests
  addInterestBuilding: protectedProcedure
    .input(z.object({ buildingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check building exists
      const building = await ctx.db.query.buildings.findFirst({
        where: eq(buildings.id, input.buildingId),
      });

      if (!building) {
        return { success: false, message: "Строение не найдено" };
      }

      // Check if already added
      const existing = await ctx.db.query.userInterestBuildings.findFirst({
        where: and(
          eq(userInterestBuildings.userId, userId),
          eq(userInterestBuildings.buildingId, input.buildingId)
        ),
      });

      if (existing) {
        return { success: true, message: "Строение уже добавлено" };
      }

      // Add interest
      await ctx.db.insert(userInterestBuildings).values({
        userId,
        buildingId: input.buildingId,
        autoAdded: false,
      });

      return { success: true };
    }),

  // Remove building from interests
  removeInterestBuilding: protectedProcedure
    .input(z.object({ buildingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db
        .delete(userInterestBuildings)
        .where(
          and(
            eq(userInterestBuildings.userId, userId),
            eq(userInterestBuildings.buildingId, input.buildingId)
          )
        );

      return { success: true };
    }),

  // Get all available buildings for selection
  getAvailableBuildings: protectedProcedure.query(async ({ ctx }) => {
    const allBuildings = await ctx.db.query.buildings.findMany({
      where: eq(buildings.active, true),
      orderBy: (b, { asc }) => [asc(b.number)],
    });

    return allBuildings.map((b) => ({
      id: b.id,
      number: b.number,
      title: b.title,
      liter: b.liter,
    }));
  }),
});
