import { env } from "~/env";

// ============================================================================
// Telegram Bot API Types
// ============================================================================

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChatMember {
  user: TelegramUser;
  status: "creator" | "administrator" | "member" | "restricted" | "left" | "kicked";
}

interface TelegramChatAdministrator extends TelegramChatMember {
  can_be_edited?: boolean;
  is_anonymous?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  custom_title?: string;
}

// ============================================================================
// Telegram Service
// ============================================================================

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

/**
 * Check if Telegram is configured
 */
export function isTelegramConfigured(): boolean {
  return !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_NEWS_CHANNEL_ID);
}

/**
 * Send text message to Telegram channel
 */
export async function sendTelegramMessage(
  text: string,
  options?: {
    parseMode?: "HTML" | "Markdown" | "MarkdownV2";
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
  }
): Promise<TelegramMessage | null> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_NEWS_CHANNEL_ID) {
    console.warn("[Telegram] Bot token or channel ID not configured");
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_NEWS_CHANNEL_ID,
        text,
        parse_mode: options?.parseMode ?? "HTML",
        disable_web_page_preview: options?.disableWebPagePreview ?? false,
        disable_notification: options?.disableNotification ?? false,
      }),
    });

    const data = (await response.json()) as TelegramResponse<TelegramMessage>;

    if (!data.ok) {
      console.error("[Telegram] API error:", data.description);
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    console.error("[Telegram] Send message error:", error);
    return null;
  }
}

/**
 * Send photo with caption to Telegram channel
 */
export async function sendTelegramPhoto(
  photoUrl: string,
  caption: string,
  options?: {
    parseMode?: "HTML" | "Markdown" | "MarkdownV2";
    disableNotification?: boolean;
  }
): Promise<TelegramMessage | null> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_NEWS_CHANNEL_ID) {
    console.warn("[Telegram] Bot token or channel ID not configured");
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_NEWS_CHANNEL_ID,
        photo: photoUrl,
        caption,
        parse_mode: options?.parseMode ?? "HTML",
        disable_notification: options?.disableNotification ?? false,
      }),
    });

    const data = (await response.json()) as TelegramResponse<TelegramMessage>;

    if (!data.ok) {
      console.error("[Telegram] API error:", data.description);
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    console.error("[Telegram] Send photo error:", error);
    return null;
  }
}

/**
 * Publish news to Telegram channel
 */
export async function publishNewsToTelegram(options: {
  title: string;
  text: string;
  sourceUrl: string;
  coverImage?: string | null;
}): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const { title, text, sourceUrl, coverImage } = options;

  // Build message
  const fullMessage = [
    `<b>${escapeHtml(title)}</b>`,
    "",
    text,
    "",
    `<a href="${sourceUrl}">Читать на сайте →</a>`,
  ].join("\n");

  // Telegram message limit is 4096 characters
  const truncatedMessage =
    fullMessage.length > 4000 ? fullMessage.slice(0, 3997) + "..." : fullMessage;

  // If there's a cover image, send as photo with caption
  // Note: Photo caption is limited to 1024 characters
  if (coverImage) {
    const captionLimit = 1024;
    const caption =
      truncatedMessage.length > captionLimit
        ? truncatedMessage.slice(0, captionLimit - 50) +
          `...\n\n<a href="${sourceUrl}">Читать полностью →</a>`
        : truncatedMessage;

    const result = await sendTelegramPhoto(coverImage, caption);

    if (result) {
      return { success: true, messageId: result.message_id };
    }

    // If photo failed (maybe invalid URL), fall back to text message
    console.warn("[Telegram] Photo send failed, falling back to text");
  }

  // Send as text message
  const result = await sendTelegramMessage(truncatedMessage);

  if (result) {
    return { success: true, messageId: result.message_id };
  }

  return { success: false, error: "Failed to send message" };
}

/**
 * Escape HTML entities for Telegram
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ============================================================================
// Admin Chat Functions
// ============================================================================

/**
 * Check if admin chat is configured
 */
export function isAdminChatConfigured(): boolean {
  return !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_ADMIN_CHAT_ID);
}

/**
 * Get admin chat ID from environment
 */
export function getAdminChatId(): string | null {
  return env.TELEGRAM_ADMIN_CHAT_ID ?? null;
}

/**
 * Get chat administrators from Telegram
 */
export async function getChatAdministrators(
  chatId?: string
): Promise<TelegramChatAdministrator[] | null> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] Bot token not configured");
    return null;
  }

  const targetChatId = chatId ?? env.TELEGRAM_ADMIN_CHAT_ID;
  if (!targetChatId) {
    console.warn("[Telegram] Admin chat ID not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${TELEGRAM_API_BASE}${env.TELEGRAM_BOT_TOKEN}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: targetChatId,
        }),
      }
    );

    const data = (await response.json()) as TelegramResponse<TelegramChatAdministrator[]>;

    if (!data.ok) {
      console.error("[Telegram] API error:", data.description);
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    console.error("[Telegram] Get chat administrators error:", error);
    return null;
  }
}

/**
 * Check if a user is in the admin chat
 * Returns member status or null if check failed
 */
export async function checkChatMember(
  userId: number,
  chatId?: string
): Promise<TelegramChatMember | null> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] Bot token not configured");
    return null;
  }

  const targetChatId = chatId ?? env.TELEGRAM_ADMIN_CHAT_ID;
  if (!targetChatId) {
    console.warn("[Telegram] Admin chat ID not configured");
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${env.TELEGRAM_BOT_TOKEN}/getChatMember`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        user_id: userId,
      }),
    });

    const data = (await response.json()) as TelegramResponse<TelegramChatMember>;

    if (!data.ok) {
      // User not found in chat returns an error
      if (data.error_code === 400) {
        return { user: { id: userId, is_bot: false, first_name: "Unknown" }, status: "left" };
      }
      console.error("[Telegram] API error:", data.description);
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    console.error("[Telegram] Check chat member error:", error);
    return null;
  }
}

/**
 * Get bot info (to identify the bot's user_id)
 */
export async function getBotInfo(): Promise<TelegramUser | null> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] Bot token not configured");
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${env.TELEGRAM_BOT_TOKEN}/getMe`, {
      method: "GET",
    });

    const data = (await response.json()) as TelegramResponse<TelegramUser>;

    if (!data.ok) {
      console.error("[Telegram] API error:", data.description);
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    console.error("[Telegram] Get bot info error:", error);
    return null;
  }
}
