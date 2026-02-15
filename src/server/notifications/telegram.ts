import { env } from "~/env";
import { telegramLogger } from "~/lib/logger";

/**
 * Telegram notification service for admin events
 * Sends notifications to a dedicated Telegram channel about important system events
 */

export type NotificationEvent =
  | "claim_created"
  | "claim_approved"
  | "claim_rejected"
  | "publication_created"
  | "publication_published"
  | "publication_moderated"
  | "news_created"
  | "news_published"
  | "user_registered"
  | "feedback_received";

export interface NotificationData {
  event: NotificationEvent;
  title: string;
  description?: string;
  metadata?: Record<string, string | number | boolean>;
  url?: string;
  userId?: string;
  userName?: string;
}

/**
 * Format notification message for Telegram
 */
function formatNotificationMessage(data: NotificationData): string {
  const lines: string[] = [];

  // Event emoji
  const eventEmojis: Record<NotificationEvent, string> = {
    claim_created: "📝",
    claim_approved: "✅",
    claim_rejected: "❌",
    publication_created: "📢",
    publication_published: "🌐",
    publication_moderated: "🔍",
    news_created: "📰",
    news_published: "🗞️",
    user_registered: "👤",
    feedback_received: "💬",
  };

  const emoji = eventEmojis[data.event] ?? "ℹ️";

  // Title
  lines.push(`${emoji} <b>${escapeHtml(data.title)}</b>`);
  lines.push("");

  // Description
  if (data.description) {
    lines.push(escapeHtml(data.description));
    lines.push("");
  }

  // User info
  if (data.userName || data.userId) {
    const userInfo = data.userName
      ? `Пользователь: ${escapeHtml(data.userName)}`
      : `User ID: ${data.userId}`;
    lines.push(userInfo);
  }

  // Metadata
  if (data.metadata && Object.keys(data.metadata).length > 0) {
    lines.push("");
    Object.entries(data.metadata).forEach(([key, value]) => {
      lines.push(`${escapeHtml(key)}: ${escapeHtml(String(value))}`);
    });
  }

  // URL
  if (data.url) {
    lines.push("");
    lines.push(`<a href="${escapeHtml(data.url)}">Перейти к объекту</a>`);
  }

  // Timestamp
  lines.push("");
  lines.push(`<i>${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</i>`);

  return lines.join("\n");
}

/**
 * Escape HTML special characters for Telegram
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send notification to Telegram channel
 */
export async function sendTelegramNotification(data: NotificationData): Promise<boolean> {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const channelId = env.TELEGRAM_NOTIFICATIONS_CHANNEL_ID;

  // Skip if Telegram is not configured
  if (!botToken || !channelId) {
    telegramLogger.debug("Skipping notification - Telegram not configured");
    return false;
  }

  const message = formatNotificationMessage(data);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      telegramLogger.error({ error, event: data.event }, "Failed to send notification");
      return false;
    }

    telegramLogger.info({ event: data.event, title: data.title }, "Notification sent");
    return true;
  } catch (error) {
    telegramLogger.error({ err: error, event: data.event }, "Error sending notification");
    return false;
  }
}

/**
 * Send notification asynchronously (fire and forget)
 */
export function sendTelegramNotificationAsync(data: NotificationData): void {
  // Fire and forget - don't block the main request
  void sendTelegramNotification(data).catch((error) => {
    telegramLogger.error({ err: error, event: data.event }, "Async notification failed");
  });
}
