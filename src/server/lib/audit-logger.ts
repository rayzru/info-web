/**
 * Централизованный сервис логирования действий
 *
 * Используется для записи audit logs по всей системе.
 * Поддерживает как централизованные логи (audit_logs), так и entity-specific history.
 */

import { db } from "~/server/db";
import {
  AUDIT_ACTION_LABELS,
  type AuditAction,
  type AuditEntityType,
  auditLogs,
  type CreateAuditLogInput,
} from "~/server/db/schema";

// ============================================================================
// Types
// ============================================================================

export interface AuditLogContext {
  actorId?: string | null;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogOptions {
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  changedFields?: string[];
  metadata?: Record<string, unknown>;
  description?: string; // Override auto-generated description
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Создаёт запись в audit_logs
 */
export async function createAuditLog(input: CreateAuditLogInput) {
  return await db.insert(auditLogs).values({
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    actorId: input.actorId ?? null,
    previousState: input.previousState ?? null,
    newState: input.newState ?? null,
    changedFields: input.changedFields ?? null,
    description: input.description,
    metadata: input.metadata ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });
}

/**
 * Создаёт audit log с автогенерацией описания
 */
export async function logAction(
  entityType: AuditEntityType,
  entityId: string,
  action: AuditAction,
  context: AuditLogContext,
  options: AuditLogOptions = {}
) {
  const description = options.description ?? generateDescription(action, options);

  return await createAuditLog({
    entityType,
    entityId,
    action,
    actorId: context.actorId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    previousState: options.previousState,
    newState: options.newState,
    changedFields: options.changedFields,
    description,
    metadata: options.metadata,
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Генерирует человекочитаемое описание действия
 */
function generateDescription(action: AuditAction, options: AuditLogOptions): string {
  const baseLabel = AUDIT_ACTION_LABELS[action];

  // Для некоторых действий добавляем детали из metadata
  const metadata = options.metadata;

  if (metadata) {
    switch (action) {
      case "user_blocked":
        return metadata.reason ? `${baseLabel}. Причина: ${metadata.reason as string}` : baseLabel;

      case "user_unblocked":
        return metadata.reason ? `${baseLabel}. Причина: ${metadata.reason as string}` : baseLabel;

      case "role_granted":
        return metadata.role ? `${baseLabel}: ${metadata.role as string}` : baseLabel;

      case "role_revoked":
        return metadata.role ? `${baseLabel}: ${metadata.role as string}` : baseLabel;

      case "listing_rejected":
      case "publication_rejected":
        return metadata.reason ? `${baseLabel}. Причина: ${metadata.reason as string}` : baseLabel;

      case "listing_archived":
        return metadata.reason ? `${baseLabel}. Причина: ${metadata.reason as string}` : baseLabel;

      case "deletion_rejected":
        return metadata.reason ? `${baseLabel}. Причина: ${metadata.reason as string}` : baseLabel;

      case "feedback_status_changed":
        if (metadata.fromStatus && metadata.toStatus) {
          return `${baseLabel}: ${metadata.fromStatus as string} → ${metadata.toStatus as string}`;
        }
        return baseLabel;

      case "feedback_priority_changed":
        if (metadata.fromPriority && metadata.toPriority) {
          return `${baseLabel}: ${metadata.fromPriority as string} → ${metadata.toPriority as string}`;
        }
        return baseLabel;

      case "feedback_assigned":
        return metadata.assigneeName
          ? `${baseLabel}: ${metadata.assigneeName as string}`
          : baseLabel;

      case "feedback_forwarded":
        return metadata.forwardedTo ? `${baseLabel}: ${metadata.forwardedTo as string}` : baseLabel;

      default:
        return baseLabel;
    }
  }

  return baseLabel;
}

/**
 * Извлекает изменённые поля между двумя объектами
 */
export function getChangedFields<T extends Record<string, unknown>>(
  previous: T,
  current: T
): string[] {
  const changed: string[] = [];

  for (const key in current) {
    if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
      changed.push(key);
    }
  }

  return changed;
}

/**
 * Создаёт объект состояния для логирования (фильтрует чувствительные поля)
 */
export function sanitizeStateForLog<T extends Record<string, unknown>>(
  state: T,
  sensitiveFields: string[] = ["passwordHash", "password", "token", "secret"]
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(state)) {
    if (sensitiveFields.includes(key)) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// ============================================================================
// Convenience Functions for Common Actions
// ============================================================================

/**
 * Логирует блокировку пользователя
 */
export async function logUserBlocked(
  userId: string,
  blockId: string,
  context: AuditLogContext,
  details: {
    category: string;
    reason?: string;
    violatedRules?: string[];
  }
) {
  return await logAction("user_block", blockId, "user_blocked", context, {
    metadata: {
      targetUserId: userId,
      category: details.category,
      reason: details.reason,
      violatedRules: details.violatedRules,
    },
    newState: details,
  });
}

/**
 * Логирует разблокировку пользователя
 */
export async function logUserUnblocked(
  userId: string,
  blockId: string,
  context: AuditLogContext,
  reason?: string
) {
  return await logAction("user_block", blockId, "user_unblocked", context, {
    metadata: {
      targetUserId: userId,
      reason,
    },
  });
}

/**
 * Логирует выдачу роли
 */
export async function logRoleGranted(userId: string, role: string, context: AuditLogContext) {
  return await logAction("user_role", userId, "role_granted", context, {
    metadata: { role, targetUserId: userId },
  });
}

/**
 * Логирует отзыв роли
 */
export async function logRoleRevoked(
  userId: string,
  role: string,
  context: AuditLogContext,
  reason?: string
) {
  return await logAction("user_role", userId, "role_revoked", context, {
    metadata: { role, targetUserId: userId, reason },
  });
}

/**
 * Логирует действие с объявлением (listing)
 */
export async function logListingAction(
  listingId: string,
  action: Extract<
    AuditAction,
    | "listing_created"
    | "listing_updated"
    | "listing_submitted"
    | "listing_approved"
    | "listing_rejected"
    | "listing_archived"
    | "listing_renewed"
    | "listing_deleted"
  >,
  context: AuditLogContext,
  options?: AuditLogOptions
) {
  return await logAction("listing", listingId, action, context, options);
}

/**
 * Логирует действие с новостью
 */
export async function logNewsAction(
  newsId: string,
  action: Extract<
    AuditAction,
    | "news_created"
    | "news_updated"
    | "news_published"
    | "news_scheduled"
    | "news_archived"
    | "news_deleted"
    | "news_telegram_sent"
  >,
  context: AuditLogContext,
  options?: AuditLogOptions
) {
  return await logAction("news", newsId, action, context, options);
}

/**
 * Логирует действие с публикацией
 */
export async function logPublicationAction(
  publicationId: string,
  action: Extract<
    AuditAction,
    | "publication_created"
    | "publication_updated"
    | "publication_submitted"
    | "publication_approved"
    | "publication_rejected"
    | "publication_archived"
    | "publication_published"
    | "publication_pinned"
    | "publication_unpinned"
    | "publication_moderation_vote"
    | "publication_deleted"
  >,
  context: AuditLogContext,
  options?: AuditLogOptions
) {
  return await logAction("publication", publicationId, action, context, options);
}

/**
 * Логирует действие с обратной связью (для централизованного audit log)
 */
export async function logFeedbackAction(
  feedbackId: string,
  action: Extract<
    AuditAction,
    | "feedback_created"
    | "feedback_status_changed"
    | "feedback_priority_changed"
    | "feedback_assigned"
    | "feedback_forwarded"
    | "feedback_responded"
    | "feedback_closed"
    | "feedback_reopened"
  >,
  context: AuditLogContext,
  options?: AuditLogOptions
) {
  return await logAction("feedback", feedbackId, action, context, options);
}

/**
 * Логирует действие с запросом на удаление
 */
export async function logDeletionRequestAction(
  requestId: string,
  action: Extract<
    AuditAction,
    "deletion_requested" | "deletion_approved" | "deletion_rejected" | "deletion_completed"
  >,
  context: AuditLogContext,
  options?: AuditLogOptions
) {
  return await logAction("deletion_request", requestId, action, context, options);
}
