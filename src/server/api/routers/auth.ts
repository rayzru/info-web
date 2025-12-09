import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";

import {
  users,
  accounts,
  passwordResetTokens,
  userRoles,
} from "~/server/db/schema";
import { notifyAsync, getProviderDisplayName } from "~/server/notifications";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// Password requirements
const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не менее 8 символов")
  .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру");

export const authRouter = createTRPCRouter({
  // Register new user with email and password
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Некорректный email"),
        password: passwordSchema,
        name: z.string().min(2, "Имя должно быть не менее 2 символов"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email.toLowerCase()),
      });

      if (existingUser) {
        if (existingUser.passwordHash) {
          throw new Error("Пользователь с таким email уже зарегистрирован");
        }
        // User exists via OAuth but has no password - allow setting password
        const passwordHash = await bcrypt.hash(input.password, 12);
        await ctx.db
          .update(users)
          .set({ passwordHash, name: input.name })
          .where(eq(users.id, existingUser.id));

        return { success: true, message: "Пароль установлен для существующего аккаунта" };
      }

      // Create new user
      const passwordHash = await bcrypt.hash(input.password, 12);
      const [newUser] = await ctx.db
        .insert(users)
        .values({
          email: input.email.toLowerCase(),
          name: input.name,
          passwordHash,
          emailVerified: null, // Requires verification
        })
        .returning();

      // Assign Guest role by default
      if (newUser) {
        await ctx.db.insert(userRoles).values({
          userId: newUser.id,
          role: "Guest",
        });

        // Send welcome notification
        notifyAsync({
          type: "user.registered",
          userId: newUser.id,
          email: input.email.toLowerCase(),
          name: input.name,
        });
      }

      return { success: true, message: "Аккаунт создан. Войдите с вашим email и паролем." };
    }),

  // Request password reset
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email.toLowerCase()),
      });

      // Always return success to prevent email enumeration
      if (!user || user.isDeleted) {
        return { success: true, message: "Если email существует, на него отправлена ссылка для сброса пароля" };
      }

      // Generate token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Delete any existing tokens for this user
      await ctx.db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.id));

      // Create new token
      await ctx.db.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expires,
      });

      // Send password reset notification
      notifyAsync({
        type: "password.reset_requested",
        userId: user.id,
        email: user.email,
        name: user.name ?? "Пользователь",
        resetToken: token,
      });

      return { success: true, message: "Если email существует, на него отправлена ссылка для сброса пароля" };
    }),

  // Reset password with token
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find valid token
      const resetToken = await ctx.db.query.passwordResetTokens.findFirst({
        where: and(
          eq(passwordResetTokens.token, input.token),
          gt(passwordResetTokens.expires, new Date())
        ),
        with: { user: true },
      });

      if (!resetToken || resetToken.usedAt) {
        throw new Error("Недействительная или истёкшая ссылка для сброса пароля");
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(input.password, 12);

      // Update user password
      await ctx.db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.id, resetToken.userId));

      // Mark token as used
      await ctx.db
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.id, resetToken.id));

      // Send password reset completed notification
      if (resetToken.user) {
        notifyAsync({
          type: "password.reset_completed",
          userId: resetToken.userId,
          email: resetToken.user.email,
          name: resetToken.user.name ?? "Пользователь",
        });
      }

      return { success: true, message: "Пароль успешно изменён" };
    }),

  // Change password (for authenticated users)
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().optional(),
        newPassword: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // If user has a password, verify current password
      if (user.passwordHash) {
        if (!input.currentPassword) {
          throw new Error("Введите текущий пароль");
        }
        const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
        if (!isValid) {
          throw new Error("Неверный текущий пароль");
        }
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(input.newPassword, 12);

      // Update password
      await ctx.db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.id, user.id));

      // Send password changed notification
      notifyAsync({
        type: "password.changed",
        userId: user.id,
        email: user.email,
        name: user.name ?? "Пользователь",
      });

      return { success: true, message: "Пароль успешно изменён" };
    }),

  // Get linked accounts for current user
  getLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const linkedAccounts = await ctx.db
      .select({
        provider: accounts.provider,
        providerAccountId: accounts.providerAccountId,
      })
      .from(accounts)
      .where(eq(accounts.userId, ctx.session.user.id));

    // Also check if password is set
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });

    return {
      accounts: linkedAccounts,
      hasPassword: !!user?.passwordHash,
    };
  }),

  // Unlink OAuth account
  unlinkAccount: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check how many auth methods user has
      const linkedAccounts = await ctx.db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, ctx.session.user.id));

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      const hasPassword = !!user?.passwordHash;
      const totalAuthMethods = linkedAccounts.length + (hasPassword ? 1 : 0);

      if (totalAuthMethods <= 1) {
        throw new Error("Нельзя отвязать единственный способ входа. Сначала добавьте другой способ авторизации.");
      }

      // Delete the account link
      await ctx.db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, ctx.session.user.id),
            eq(accounts.provider, input.provider)
          )
        );

      // Send account unlinked notification
      if (user) {
        notifyAsync({
          type: "account.unlinked",
          userId: user.id,
          email: user.email,
          name: user.name ?? "Пользователь",
          provider: input.provider,
          providerName: getProviderDisplayName(input.provider),
        });
      }

      return { success: true };
    }),
});
