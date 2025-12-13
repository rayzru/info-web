/**
 * Ранговая система пользователей
 *
 * Иерархия (от высшего к низшему):
 * 1. Администрация - управляют ресурсом
 * 2. Собственники - владельцы недвижимости
 * 3. Представители УК - от организаций
 * 4. Арендаторы - пользователи недвижимости
 * 5. Редакторы - создатели контента
 * 6. Гости - без подтверждённого статуса
 */

import type { UserRole } from "~/server/auth/rbac";

// Ранги по приоритету (меньше = выше статус)
export const RANK_PRIORITY = {
  // Администрация (1-10)
  Root: 1,
  SuperAdmin: 2,
  Admin: 3,
  Moderator: 5,

  // Представители УК (20-30)
  ComplexChairman: 20,
  BuildingChairman: 21,
  ComplexRepresenative: 25,

  // Собственники (40-50)
  ApartmentOwner: 40,
  ParkingOwner: 41,
  StoreOwner: 42,

  // Арендаторы/Резиденты (60-70)
  ApartmentResident: 60,
  ParkingResident: 61,
  StoreRepresenative: 62,

  // Редакторы (80)
  Editor: 80,

  // Гости (100)
  Guest: 100,
} as const;

// Группы рангов для визуального отображения
export type RankTier =
  | "admin"      // Администрация - красный/золотой
  | "management" // УК - синий
  | "owner"      // Собственники - зелёный
  | "resident"   // Арендаторы - фиолетовый
  | "editor"     // Редакторы - оранжевый
  | "guest";     // Гости - серый

export interface RankConfig {
  tier: RankTier;
  label: string;
  shortLabel: string;
  description: string;
  ringColor: string;      // Цвет обводки аватара (Tailwind)
  badgeColor: string;     // Цвет бейджа (Tailwind bg)
  textColor: string;      // Цвет текста статуса
  icon?: string;          // Опциональная иконка
}

export const RANK_CONFIG: Record<UserRole, RankConfig> = {
  // Администрация
  Root: {
    tier: "admin",
    label: "Администратор",
    shortLabel: "Админ",
    description: "Полный доступ к системе",
    ringColor: "ring-red-500",
    badgeColor: "bg-red-500",
    textColor: "text-red-600",
  },
  SuperAdmin: {
    tier: "admin",
    label: "Администратор",
    shortLabel: "Админ",
    description: "Управление системой",
    ringColor: "ring-red-500",
    badgeColor: "bg-red-500",
    textColor: "text-red-600",
  },
  Admin: {
    tier: "admin",
    label: "Администратор",
    shortLabel: "Админ",
    description: "Управление контентом и пользователями",
    ringColor: "ring-red-400",
    badgeColor: "bg-red-400",
    textColor: "text-red-500",
  },
  Moderator: {
    tier: "admin",
    label: "Модератор",
    shortLabel: "Мод",
    description: "Модерация контента",
    ringColor: "ring-orange-500",
    badgeColor: "bg-orange-500",
    textColor: "text-orange-600",
  },

  // Представители УК
  ComplexChairman: {
    tier: "management",
    label: "Председатель комплекса",
    shortLabel: "Председатель",
    description: "Управление жилым комплексом",
    ringColor: "ring-blue-600",
    badgeColor: "bg-blue-600",
    textColor: "text-blue-600",
  },
  BuildingChairman: {
    tier: "management",
    label: "Председатель дома",
    shortLabel: "Председатель",
    description: "Управление домом",
    ringColor: "ring-blue-500",
    badgeColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  ComplexRepresenative: {
    tier: "management",
    label: "Представитель УК",
    shortLabel: "УК",
    description: "Представитель управляющей компании",
    ringColor: "ring-blue-400",
    badgeColor: "bg-blue-400",
    textColor: "text-blue-500",
  },

  // Собственники
  ApartmentOwner: {
    tier: "owner",
    label: "Собственник квартиры",
    shortLabel: "Собственник",
    description: "Владелец квартиры в комплексе",
    ringColor: "ring-green-500",
    badgeColor: "bg-green-500",
    textColor: "text-green-600",
  },
  ParkingOwner: {
    tier: "owner",
    label: "Собственник парковки",
    shortLabel: "Собственник",
    description: "Владелец парковочного места",
    ringColor: "ring-green-500",
    badgeColor: "bg-green-500",
    textColor: "text-green-600",
  },
  StoreOwner: {
    tier: "owner",
    label: "Владелец магазина",
    shortLabel: "Владелец",
    description: "Владелец коммерческого помещения",
    ringColor: "ring-green-500",
    badgeColor: "bg-green-500",
    textColor: "text-green-600",
  },

  // Арендаторы/Резиденты
  ApartmentResident: {
    tier: "resident",
    label: "Житель",
    shortLabel: "Житель",
    description: "Проживающий в квартире",
    ringColor: "ring-violet-500",
    badgeColor: "bg-violet-500",
    textColor: "text-violet-600",
  },
  ParkingResident: {
    tier: "resident",
    label: "Арендатор парковки",
    shortLabel: "Арендатор",
    description: "Арендатор парковочного места",
    ringColor: "ring-violet-400",
    badgeColor: "bg-violet-400",
    textColor: "text-violet-500",
  },
  StoreRepresenative: {
    tier: "resident",
    label: "Сотрудник магазина",
    shortLabel: "Сотрудник",
    description: "Представитель коммерческого помещения",
    ringColor: "ring-violet-400",
    badgeColor: "bg-violet-400",
    textColor: "text-violet-500",
  },

  // Редакторы
  Editor: {
    tier: "editor",
    label: "Редактор",
    shortLabel: "Редактор",
    description: "Создание и редактирование контента",
    ringColor: "ring-amber-500",
    badgeColor: "bg-amber-500",
    textColor: "text-amber-600",
  },

  // Гости
  Guest: {
    tier: "guest",
    label: "Гость",
    shortLabel: "Гость",
    description: "Незарегистрированный пользователь",
    ringColor: "ring-gray-300",
    badgeColor: "bg-gray-400",
    textColor: "text-gray-500",
  },
};

// Конфигурация tier'ов для общего отображения
export const TIER_CONFIG: Record<RankTier, { label: string; ringColor: string; badgeColor: string; textColor: string }> = {
  admin: {
    label: "Администрация",
    ringColor: "ring-red-500",
    badgeColor: "bg-red-500",
    textColor: "text-red-600",
  },
  management: {
    label: "Управление",
    ringColor: "ring-blue-500",
    badgeColor: "bg-blue-500",
    textColor: "text-blue-600",
  },
  owner: {
    label: "Собственник",
    ringColor: "ring-green-500",
    badgeColor: "bg-green-500",
    textColor: "text-green-600",
  },
  resident: {
    label: "Резидент",
    ringColor: "ring-violet-500",
    badgeColor: "bg-violet-500",
    textColor: "text-violet-600",
  },
  editor: {
    label: "Редактор",
    ringColor: "ring-amber-500",
    badgeColor: "bg-amber-500",
    textColor: "text-amber-600",
  },
  guest: {
    label: "Гость",
    ringColor: "ring-gray-300",
    badgeColor: "bg-gray-400",
    textColor: "text-gray-500",
  },
};

/**
 * Получить наивысший ранг из списка ролей пользователя
 */
export function getHighestRank(roles: UserRole[]): UserRole {
  if (roles.length === 0) return "Guest";

  return roles.reduce((highest, role) => {
    const currentPriority = RANK_PRIORITY[role] ?? 100;
    const highestPriority = RANK_PRIORITY[highest] ?? 100;
    return currentPriority < highestPriority ? role : highest;
  }, roles[0]!);
}

/**
 * Получить конфигурацию для наивысшего ранга
 */
export function getRankConfig(roles: UserRole[]): RankConfig {
  const highestRole = getHighestRank(roles);
  return RANK_CONFIG[highestRole];
}

/**
 * Получить tier для отображения (на основе наивысшего ранга)
 */
export function getRankTier(roles: UserRole[]): RankTier {
  return getRankConfig(roles).tier;
}

/**
 * Проверить, является ли пользователь администрацией
 */
export function isAdminTier(roles: UserRole[]): boolean {
  return getRankTier(roles) === "admin";
}

/**
 * Проверить, является ли пользователь собственником
 */
export function isOwnerTier(roles: UserRole[]): boolean {
  const tier = getRankTier(roles);
  return tier === "owner" || tier === "admin" || tier === "management";
}
