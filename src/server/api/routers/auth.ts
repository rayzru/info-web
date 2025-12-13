import bcrypt from "bcryptjs";
import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

import {
  passwordSchema,
  registerInputSchema,
} from "~/lib/validations/auth";
import {
  accounts,
  emailVerificationTokens,
  passwordResetTokens,
  userRoles,
  users,
} from "~/server/db/schema";
import { getProviderDisplayName,notifyAsync } from "~/server/notifications";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  // Register new user with email and password
  register: publicProcedure
    .input(registerInputSchema)
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

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await ctx.db.insert(emailVerificationTokens).values({
          userId: newUser.id,
          token: verificationToken,
          expires,
        });

        // Send verification email
        notifyAsync({
          type: "email.verification_requested",
          userId: newUser.id,
          email: input.email.toLowerCase(),
          name: input.name,
          verificationToken,
        });
      }

      return { success: true, message: "На вашу почту отправлено письмо для подтверждения email." };
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

      // Update user password and verify email (user proved email ownership by clicking reset link)
      await ctx.db
        .update(users)
        .set({
          passwordHash,
          emailVerified: resetToken.user?.emailVerified ?? new Date(),
        })
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

  // Verify email with token
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find valid token
      const verificationToken = await ctx.db.query.emailVerificationTokens.findFirst({
        where: and(
          eq(emailVerificationTokens.token, input.token),
          gt(emailVerificationTokens.expires, new Date())
        ),
        with: { user: true },
      });

      if (!verificationToken || verificationToken.usedAt) {
        throw new Error("Недействительная или истёкшая ссылка для подтверждения email");
      }

      // Mark email as verified
      await ctx.db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, verificationToken.userId));

      // Mark token as used
      await ctx.db
        .update(emailVerificationTokens)
        .set({ usedAt: new Date() })
        .where(eq(emailVerificationTokens.id, verificationToken.id));

      // Send welcome email now that email is verified
      if (verificationToken.user) {
        notifyAsync({
          type: "user.registered",
          userId: verificationToken.userId,
          email: verificationToken.user.email,
          name: verificationToken.user.name ?? "Пользователь",
        });
      }

      return { success: true, message: "Email успешно подтверждён! Теперь вы можете войти в аккаунт." };
    }),

  // Resend verification email
  resendVerificationEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email.toLowerCase()),
      });

      // Always return success to prevent email enumeration
      if (!user || user.isDeleted || user.emailVerified) {
        return { success: true, message: "Если email существует и не подтверждён, на него будет отправлено письмо" };
      }

      // Check if user registered via password (has passwordHash)
      if (!user.passwordHash) {
        return { success: true, message: "Если email существует и не подтверждён, на него будет отправлено письмо" };
      }

      // Delete any existing tokens for this user
      await ctx.db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.userId, user.id));

      // Generate new token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await ctx.db.insert(emailVerificationTokens).values({
        userId: user.id,
        token: verificationToken,
        expires,
      });

      // Send verification email
      notifyAsync({
        type: "email.verification_requested",
        userId: user.id,
        email: user.email,
        name: user.name ?? "Пользователь",
        verificationToken,
      });

      return { success: true, message: "Если email существует и не подтверждён, на него будет отправлено письмо" };
    }),
});
