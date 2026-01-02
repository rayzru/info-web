import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    // OAuth Providers
    YANDEX_CLIENT_ID: z.string(),
    YANDEX_CLIENT_SECRET: z.string(),
    // VK OAuth (optional)
    VK_CLIENT_ID: z.string().optional(),
    VK_CLIENT_SECRET: z.string().optional(),
    // Google OAuth (optional)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    // Mail.ru OAuth (optional)
    MAILRU_CLIENT_ID: z.string().optional(),
    MAILRU_CLIENT_SECRET: z.string().optional(),
    // Одноклассники OAuth (optional) - uses VK ID platform
    OK_CLIENT_ID: z.string().optional(),
    OK_CLIENT_SECRET: z.string().optional(),
    OK_PUBLIC_KEY: z.string().optional(),
    // Сбер ID OAuth (optional) - requires agreement with Sber
    SBER_CLIENT_ID: z.string().optional(),
    SBER_CLIENT_SECRET: z.string().optional(),
    // Тинькофф ID (T-ID) OAuth (optional)
    TINKOFF_CLIENT_ID: z.string().optional(),
    TINKOFF_CLIENT_SECRET: z.string().optional(),
    // Telegram Bot (for auth via bot)
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    // Telegram News Channel (for news publishing)
    TELEGRAM_NEWS_CHANNEL_ID: z.string().optional(),

    // SMTP Configuration for email sending
    // Default: localhost:25 without auth (for local postfix)
    SMTP_HOST: z.string().optional().default("127.0.0.1"),
    SMTP_PORT: z.coerce.number().optional().default(25),
    SMTP_SECURE: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM_NAME: z.string().optional().default("Сообщество соседей ЖК СР2"),
    SMTP_FROM_EMAIL: z.email().optional().default("robot@sr2.ru"),
    SMTP_REPLY_TO: z.email().optional().default("help@sr2.ru"),

    DATABASE_URL: z.string().url(),
    DATABASE_NAME: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    // OAuth Providers
    YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
    YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
    VK_CLIENT_ID: process.env.VK_CLIENT_ID,
    VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MAILRU_CLIENT_ID: process.env.MAILRU_CLIENT_ID,
    MAILRU_CLIENT_SECRET: process.env.MAILRU_CLIENT_SECRET,
    OK_CLIENT_ID: process.env.OK_CLIENT_ID,
    OK_CLIENT_SECRET: process.env.OK_CLIENT_SECRET,
    OK_PUBLIC_KEY: process.env.OK_PUBLIC_KEY,
    SBER_CLIENT_ID: process.env.SBER_CLIENT_ID,
    SBER_CLIENT_SECRET: process.env.SBER_CLIENT_SECRET,
    TINKOFF_CLIENT_ID: process.env.TINKOFF_CLIENT_ID,
    TINKOFF_CLIENT_SECRET: process.env.TINKOFF_CLIENT_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_NEWS_CHANNEL_ID: process.env.TELEGRAM_NEWS_CHANNEL_ID,
    // SMTP
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_REPLY_TO: process.env.SMTP_REPLY_TO,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
