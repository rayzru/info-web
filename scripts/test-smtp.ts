/**
 * SMTP Connection Test Script
 * Run: bun run scripts/test-smtp.ts
 */

// Load env
import "dotenv/config";

import nodemailer from "nodemailer";

const config = {
  host: process.env.SMTP_HOST ?? "smtp.yandex.ru",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== "false", // true for 465
  user: process.env.SMTP_USER ?? "robot@sr2.ru",
  password: process.env.SMTP_PASSWORD,
  fromEmail: process.env.SMTP_FROM_EMAIL ?? "robot@sr2.ru",
  fromName: process.env.SMTP_FROM_NAME ?? "Сообщество Соседей ЖК СР2",
};

async function testSmtp() {
  console.log("SMTP Configuration:");
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Secure: ${config.secure}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Password: ${config.password ? "***" : "NOT SET"}`);
  console.log("");

  if (!config.password) {
    console.error("❌ SMTP_PASSWORD is not set in .env");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  // Step 1: Verify connection
  console.log("Step 1: Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!\n");
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    process.exit(1);
  }

  // Step 2: Send test email (optional)
  const testEmail = process.argv[2];
  if (testEmail) {
    console.log(`Step 2: Sending test email to ${testEmail}...`);
    try {
      const info = await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: testEmail,
        subject: "Тестовое письмо от Парадной",
        html: `
          <h1>Тест почтового сервиса</h1>
          <p>Если вы видите это письмо, значит SMTP настроен правильно!</p>
          <p><small>Отправлено: ${new Date().toLocaleString("ru-RU")}</small></p>
        `,
      });
      console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      process.exit(1);
    }
  } else {
    console.log("Step 2: Skipped (no email address provided)");
    console.log("  To send a test email, run:");
    console.log("  bun run scripts/test-smtp.ts your@email.com");
  }
}

testSmtp();
