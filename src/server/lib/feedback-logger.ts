/**
 * Сервис логирования истории обращений (feedback)
 *
 * Записывает в entity-specific таблицу feedback_history
 * для полного отслеживания жизненного цикла обращений.
 */

import { db } from "~/server/db";
import {
  feedbackHistory,
  type FeedbackHistoryAction,
  type FeedbackStatus,
  type FeedbackPriority,
  FEEDBACK_STATUS_LABELS,
  FEEDBACK_PRIORITY_LABELS,
  FEEDBACK_HISTORY_ACTION_LABELS,
} from "~/server/db/schema";

// ============================================================================
// Types
// ============================================================================

export interface FeedbackHistoryContext {
  changedById: string;
}

// ============================================================================
// Core Function
// ============================================================================

interface CreateFeedbackHistoryInput {
  feedbackId: string;
  action: FeedbackHistoryAction;
  context: FeedbackHistoryContext;
  fromStatus?: FeedbackStatus;
  toStatus?: FeedbackStatus;
  fromPriority?: FeedbackPriority;
  toPriority?: FeedbackPriority;
  assignedToId?: string;
  forwardedTo?: string;
  response?: string;
  internalNote?: string;
  description?: string;
}

/**
 * Создаёт запись в истории обращения
 */
export async function createFeedbackHistoryRecord(
  input: CreateFeedbackHistoryInput
) {
  const description =
    input.description ?? generateFeedbackDescription(input);

  return await db.insert(feedbackHistory).values({
    feedbackId: input.feedbackId,
    action: input.action,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus ?? null,
    fromPriority: input.fromPriority ?? null,
    toPriority: input.toPriority ?? null,
    assignedToId: input.assignedToId ?? null,
    forwardedTo: input.forwardedTo ?? null,
    response: input.response ?? null,
    internalNote: input.internalNote ?? null,
    changedById: input.context.changedById,
    description,
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateFeedbackDescription(
  input: CreateFeedbackHistoryInput
): string {
  const baseLabel = FEEDBACK_HISTORY_ACTION_LABELS[input.action];

  switch (input.action) {
    case "status_changed":
      if (input.fromStatus && input.toStatus) {
        const fromLabel = FEEDBACK_STATUS_LABELS[input.fromStatus];
        const toLabel = FEEDBACK_STATUS_LABELS[input.toStatus];
        return `${baseLabel}: ${fromLabel} → ${toLabel}`;
      }
      return baseLabel;

    case "priority_changed":
      if (input.fromPriority && input.toPriority) {
        const fromLabel = FEEDBACK_PRIORITY_LABELS[input.fromPriority];
        const toLabel = FEEDBACK_PRIORITY_LABELS[input.toPriority];
        return `${baseLabel}: ${fromLabel} → ${toLabel}`;
      }
      return baseLabel;

    case "forwarded":
      return input.forwardedTo
        ? `${baseLabel}: ${input.forwardedTo}`
        : baseLabel;

    case "responded":
      return baseLabel;

    case "note_added":
      return baseLabel;

    default:
      return baseLabel;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Логирует создание обращения
 */
export async function logFeedbackCreated(
  feedbackId: string,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "created",
    context,
    description: "Обращение создано",
  });
}

/**
 * Логирует изменение статуса
 */
export async function logFeedbackStatusChanged(
  feedbackId: string,
  fromStatus: FeedbackStatus,
  toStatus: FeedbackStatus,
  context: FeedbackHistoryContext,
  internalNote?: string
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "status_changed",
    context,
    fromStatus,
    toStatus,
    internalNote,
  });
}

/**
 * Логирует изменение приоритета
 */
export async function logFeedbackPriorityChanged(
  feedbackId: string,
  fromPriority: FeedbackPriority,
  toPriority: FeedbackPriority,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "priority_changed",
    context,
    fromPriority,
    toPriority,
  });
}

/**
 * Логирует назначение ответственного
 */
export async function logFeedbackAssigned(
  feedbackId: string,
  assignedToId: string,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "assigned",
    context,
    assignedToId,
  });
}

/**
 * Логирует снятие ответственного
 */
export async function logFeedbackUnassigned(
  feedbackId: string,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "unassigned",
    context,
  });
}

/**
 * Логирует перенаправление
 */
export async function logFeedbackForwarded(
  feedbackId: string,
  forwardedTo: string,
  context: FeedbackHistoryContext,
  internalNote?: string
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "forwarded",
    context,
    forwardedTo,
    internalNote,
    toStatus: "forwarded",
  });
}

/**
 * Логирует ответ заявителю
 */
export async function logFeedbackResponded(
  feedbackId: string,
  response: string,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "responded",
    context,
    response,
  });
}

/**
 * Логирует добавление заметки
 */
export async function logFeedbackNoteAdded(
  feedbackId: string,
  internalNote: string,
  context: FeedbackHistoryContext
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "note_added",
    context,
    internalNote,
  });
}

/**
 * Логирует закрытие обращения
 */
export async function logFeedbackClosed(
  feedbackId: string,
  fromStatus: FeedbackStatus,
  context: FeedbackHistoryContext,
  internalNote?: string
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "closed",
    context,
    fromStatus,
    toStatus: "closed",
    internalNote,
  });
}

/**
 * Логирует переоткрытие обращения
 */
export async function logFeedbackReopened(
  feedbackId: string,
  fromStatus: FeedbackStatus,
  toStatus: FeedbackStatus,
  context: FeedbackHistoryContext,
  internalNote?: string
) {
  return await createFeedbackHistoryRecord({
    feedbackId,
    action: "reopened",
    context,
    fromStatus,
    toStatus,
    internalNote,
  });
}
