/**
 * Сервис логирования истории публикаций
 *
 * Записывает в entity-specific таблицу publication_history
 * для отслеживания жизненного цикла публикаций.
 */

import { db } from "~/server/db";
import {
  PUBLICATION_HISTORY_ACTION_LABELS,
  PUBLICATION_STATUS_LABELS,
  publicationHistory,
  type PublicationHistoryAction,
  type PublicationStatus,
} from "~/server/db/schema";

// ============================================================================
// Types
// ============================================================================

export interface PublicationHistoryContext {
  changedById: string;
}

// ============================================================================
// Core Function
// ============================================================================

interface CreatePublicationHistoryInput {
  publicationId: string;
  action: PublicationHistoryAction;
  context: PublicationHistoryContext;
  fromStatus?: PublicationStatus;
  toStatus?: PublicationStatus;
  moderationComment?: string;
  description?: string;
}

/**
 * Создаёт запись в истории публикации
 */
export async function createPublicationHistoryRecord(input: CreatePublicationHistoryInput) {
  const description = input.description ?? generatePublicationDescription(input);

  return await db.insert(publicationHistory).values({
    publicationId: input.publicationId,
    action: input.action,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus ?? null,
    moderationComment: input.moderationComment ?? null,
    changedById: input.context.changedById,
    description,
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function generatePublicationDescription(input: CreatePublicationHistoryInput): string {
  const baseLabel = PUBLICATION_HISTORY_ACTION_LABELS[input.action];

  switch (input.action) {
    case "submitted":
    case "approved":
    case "rejected":
    case "archived":
    case "published":
      if (input.fromStatus && input.toStatus) {
        const fromLabel = PUBLICATION_STATUS_LABELS[input.fromStatus];
        const toLabel = PUBLICATION_STATUS_LABELS[input.toStatus];
        return `${baseLabel}: ${fromLabel} → ${toLabel}`;
      }
      return baseLabel;

    case "rejected":
      if (input.moderationComment) {
        return `${baseLabel}. Причина: ${input.moderationComment}`;
      }
      return baseLabel;

    default:
      return baseLabel;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Логирует создание публикации
 */
export async function logPublicationCreated(
  publicationId: string,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "created",
    context,
    toStatus: "draft",
    description: "Публикация создана",
  });
}

/**
 * Логирует обновление публикации
 */
export async function logPublicationUpdated(
  publicationId: string,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "updated",
    context,
    description: "Публикация обновлена",
  });
}

/**
 * Логирует отправку на модерацию
 */
export async function logPublicationSubmitted(
  publicationId: string,
  fromStatus: PublicationStatus,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "submitted",
    context,
    fromStatus,
    toStatus: "pending",
  });
}

/**
 * Логирует одобрение модератором
 */
export async function logPublicationApproved(
  publicationId: string,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "approved",
    context,
    fromStatus: "pending",
    toStatus: "published",
  });
}

/**
 * Логирует отклонение модератором
 */
export async function logPublicationRejected(
  publicationId: string,
  context: PublicationHistoryContext,
  moderationComment?: string
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "rejected",
    context,
    fromStatus: "pending",
    toStatus: "rejected",
    moderationComment,
  });
}

/**
 * Логирует архивирование
 */
export async function logPublicationArchived(
  publicationId: string,
  fromStatus: PublicationStatus,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "archived",
    context,
    fromStatus,
    toStatus: "archived",
  });
}

/**
 * Логирует публикацию (прямую, без модерации)
 */
export async function logPublicationPublished(
  publicationId: string,
  fromStatus: PublicationStatus,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "published",
    context,
    fromStatus,
    toStatus: "published",
  });
}

/**
 * Логирует закрепление
 */
export async function logPublicationPinned(
  publicationId: string,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "pinned",
    context,
    description: "Публикация закреплена",
  });
}

/**
 * Логирует открепление
 */
export async function logPublicationUnpinned(
  publicationId: string,
  context: PublicationHistoryContext
) {
  return await createPublicationHistoryRecord({
    publicationId,
    action: "unpinned",
    context,
    description: "Публикация откреплена",
  });
}

/**
 * Логирует голос модератора
 */
export async function logPublicationModerationVote(
  publicationId: string,
  vote: "approve" | "reject" | "request_changes",
  context: PublicationHistoryContext,
  comment?: string
) {
  const voteLabels = {
    approve: "одобрение",
    reject: "отклонение",
    request_changes: "запрос изменений",
  };

  return await createPublicationHistoryRecord({
    publicationId,
    action: "moderation_vote",
    context,
    moderationComment: comment,
    description: `Голос модератора: ${voteLabels[vote]}${comment ? `. ${comment}` : ""}`,
  });
}
