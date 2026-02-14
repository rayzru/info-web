/**
 * Publication type identifiers (snake_case to match database schema)
 */
export const PUBLICATION_TYPES = {
  ANNOUNCEMENT: "announcement",
  EVENT: "event",
  HELP_REQUEST: "help_request",
  LOST_FOUND: "lost_found",
  RECOMMENDATION: "recommendation",
  QUESTION: "question",
  DISCUSSION: "discussion",
} as const;

export type PublicationType = (typeof PUBLICATION_TYPES)[keyof typeof PUBLICATION_TYPES];

/**
 * Publication type labels (ru locale)
 * TODO: Move to i18n system in the future
 */
export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  [PUBLICATION_TYPES.ANNOUNCEMENT]: "Объявление",
  [PUBLICATION_TYPES.EVENT]: "Мероприятие",
  [PUBLICATION_TYPES.HELP_REQUEST]: "Просьба о помощи",
  [PUBLICATION_TYPES.LOST_FOUND]: "Потеряно/найдено",
  [PUBLICATION_TYPES.RECOMMENDATION]: "Рекомендация",
  [PUBLICATION_TYPES.QUESTION]: "Вопрос",
  [PUBLICATION_TYPES.DISCUSSION]: "Обсуждение",
} as const;

/**
 * Get publication type label with fallback
 */
export function getPublicationTypeLabel(type: string): string {
  return PUBLICATION_TYPE_LABELS[type] ?? type;
}
