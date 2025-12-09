import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { deletionRequests, userProfiles, users } from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Zod schema for gender enum
const genderSchema = z.enum(["Male", "Female", "Unspecified"]);

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

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
      profile: profile ?? null,
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if profile exists
      const existingProfile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      });

      if (existingProfile) {
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
      where: and(
        eq(deletionRequests.userId, userId),
        eq(deletionRequests.status, "pending")
      ),
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
        where: and(
          eq(deletionRequests.userId, userId),
          eq(deletionRequests.status, "pending")
        ),
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
      where: and(
        eq(deletionRequests.userId, userId),
        eq(deletionRequests.status, "pending")
      ),
    });

    if (!request) {
      return {
        success: false,
        message: "Активная заявка на удаление не найдена.",
      };
    }

    // Delete the request (or mark as cancelled)
    await ctx.db
      .delete(deletionRequests)
      .where(eq(deletionRequests.id, request.id));

    return {
      success: true,
      message: "Заявка на удаление аккаунта отменена.",
    };
  }),
});
