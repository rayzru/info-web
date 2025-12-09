import nodemailer from "nodemailer";

import { env } from "~/env";

/**
 * SMTP Configuration for email sending
 * Uses sr2.ru mail server
 */
export const emailConfig = {
  from: {
    name: env.SMTP_FROM_NAME,
    address: env.SMTP_FROM_EMAIL,
  },
  replyTo: env.SMTP_REPLY_TO,
} as const;

/**
 * Create nodemailer transporter
 * Configured for sr2.ru SMTP server
 */
export function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
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
