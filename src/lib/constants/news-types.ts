/**
 * News type identifiers (kebab-case for i18n compatibility)
 */
export const NEWS_TYPES = {
  ANNOUNCEMENT: "announcement",
  EVENT: "event",
  MAINTENANCE: "maintenance",
  UPDATE: "update",
  COMMUNITY: "community",
  URGENT: "urgent",
} as const;

export type NewsType = (typeof NEWS_TYPES)[keyof typeof NEWS_TYPES];

/**
 * News type labels (ru locale)
 * TODO: Move to i18n system in the future
 */
export const NEWS_TYPE_LABELS: Record<string, string> = {
  [NEWS_TYPES.ANNOUNCEMENT]: "Объявление",
  [NEWS_TYPES.EVENT]: "Мероприятие",
  [NEWS_TYPES.MAINTENANCE]: "Тех. работы",
  [NEWS_TYPES.UPDATE]: "Обновление",
  [NEWS_TYPES.COMMUNITY]: "Сообщество",
  [NEWS_TYPES.URGENT]: "Срочное",
} as const;

/**
 * Get news type label with fallback
 */
export function getNewsTypeLabel(type: string): string {
  return NEWS_TYPE_LABELS[type] ?? type;
}
