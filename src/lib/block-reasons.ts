/**
 * Конфигурация причин блокировки пользователей
 */

// Категории блокировки
export const BLOCK_CATEGORIES = {
  rules_violation: {
    label: "Нарушение правил сообщества",
    description: "Нарушение Правил пользования ресурсом",
  },
  fraud: {
    label: "Мошенничество",
    description: "Попытка мошенничества или обмана пользователей",
  },
  spam: {
    label: "Спам",
    description: "Массовая рассылка нежелательных сообщений или объявлений",
  },
  abuse: {
    label: "Оскорбления и травля",
    description: "Систематические оскорбления, угрозы или травля других пользователей",
  },
  other: {
    label: "Другая причина",
    description: "Иная причина, не указанная в списке",
  },
} as const;

export type BlockCategory = keyof typeof BLOCK_CATEGORIES;

// Пункты правил с описаниями
export const RULES_VIOLATIONS = {
  "3.1": {
    label: "Пункт 3.1",
    title: "Запрещённый контент",
    description: "Размещение контента, нарушающего законодательство РФ или содержащего запрещённые материалы",
  },
  "3.2": {
    label: "Пункт 3.2",
    title: "Недостоверная информация",
    description: "Распространение заведомо ложной информации о жителях, управляющей компании или объектах комплекса",
  },
  "3.3": {
    label: "Пункт 3.3",
    title: "Нарушение приватности",
    description: "Публикация персональных данных третьих лиц без их согласия",
  },
  "3.4": {
    label: "Пункт 3.4",
    title: "Коммерческая реклама",
    description: "Размещение рекламы товаров и услуг, не связанных с жизнью комплекса",
  },
  "3.5": {
    label: "Пункт 3.5",
    title: "Оскорбления и агрессия",
    description: "Оскорбительные высказывания, угрозы, разжигание конфликтов",
  },
  "4.1": {
    label: "Пункт 4.1",
    title: "Фиктивные объявления",
    description: "Размещение объявлений о несуществующих объектах или без права распоряжения",
  },
  "4.2": {
    label: "Пункт 4.2",
    title: "Манипуляция ценами",
    description: "Намеренное завышение или занижение цен с целью манипуляции рынком",
  },
  "4.3": {
    label: "Пункт 4.3",
    title: "Скрытые условия",
    description: "Сокрытие существенных условий сделки или дефектов объекта",
  },
  "5.1": {
    label: "Пункт 5.1",
    title: "Множественные аккаунты",
    description: "Создание нескольких учётных записей одним пользователем",
  },
  "5.2": {
    label: "Пункт 5.2",
    title: "Обход блокировки",
    description: "Попытка обойти ограничения доступа с помощью новых аккаунтов",
  },
} as const;

export type RuleViolation = keyof typeof RULES_VIOLATIONS;

/**
 * Генерирует текст сообщения о блокировке для пользователя
 */
export function generateBlockMessage(
  category: BlockCategory,
  violatedRules?: RuleViolation[],
  customReason?: string
): string {
  const categoryInfo = BLOCK_CATEGORIES[category];

  let message = `Ваш аккаунт заблокирован.\n\nПричина: ${categoryInfo.label}`;

  if (category === "rules_violation" && violatedRules && violatedRules.length > 0) {
    message += "\n\nНарушенные пункты Правил:";
    for (const rule of violatedRules) {
      const ruleInfo = RULES_VIOLATIONS[rule];
      message += `\n• ${ruleInfo.label}: ${ruleInfo.title}`;
    }
  }

  if (customReason) {
    message += `\n\nДополнительно: ${customReason}`;
  }

  message += `

Если вы считаете, что блокировка применена ошибочно, вы можете обратиться к администрации для разъяснения обстоятельств дела.

Для обжалования решения или получения дополнительной информации направьте обращение на адрес электронной почты администрации ресурса.

Администрация оставляет за собой право не отвечать на обращения, содержащие оскорбления, угрозы или требования, противоречащие Правилам пользования ресурсом.`;

  return message;
}

/**
 * Генерирует краткое описание блокировки для админ-панели
 */
export function getBlockSummary(
  category: BlockCategory,
  violatedRules?: string[],
  customReason?: string
): string {
  const categoryInfo = BLOCK_CATEGORIES[category];

  if (category === "rules_violation" && violatedRules && violatedRules.length > 0) {
    const ruleLabels = violatedRules
      .map((rule) => RULES_VIOLATIONS[rule as RuleViolation]?.label ?? rule)
      .join(", ");
    return `${categoryInfo.label} (${ruleLabels})`;
  }

  if (category === "other" && customReason) {
    return customReason.length > 50 ? customReason.slice(0, 50) + "..." : customReason;
  }

  return categoryInfo.label;
}
