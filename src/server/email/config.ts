import nodemailer from "nodemailer";

import { env } from "~/env";

/**
 * SMTP Configuration for email sending
 * Uses sr2.ru mail server
 */
export const emailConfig = {
  from: {
    name: env.SMTP_FROM_NAME ?? "Портал SR2",
    address: env.SMTP_FROM_EMAIL ?? "robot@sr2.ru",
  },
  replyTo: env.SMTP_REPLY_TO ?? "help@sr2.ru",
} as const;

/**
 * Create nodemailer transporter
 * Configured for sr2.ru SMTP server
 * Supports both authenticated and local (no-auth) modes
 */
export function createTransporter() {
  const hasAuth = env.SMTP_USER && env.SMTP_PASSWORD;
  const isLocalhost = env.SMTP_HOST === "127.0.0.1" || env.SMTP_HOST === "localhost";

  return nodemailer.createTransport({
    host: env.SMTP_HOST ?? "127.0.0.1",
    port: env.SMTP_PORT ?? 25,
    secure: env.SMTP_SECURE ?? false,
    // Only include auth if credentials are provided
    ...(hasAuth && {
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    }),
    // For localhost connections, disable certificate validation
    // This is safe because we're connecting to local SMTP server
    ...(isLocalhost && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });
}

/**
 * Get transporter singleton
 */
let transporter: ReturnType<typeof createTransporter> | null = null;

export function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}
