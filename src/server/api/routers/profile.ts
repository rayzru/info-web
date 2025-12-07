import { eq } from "drizzle-orm";
import { z } from "zod";

import { userProfiles, users } from "~/server/db/schema";

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
});
