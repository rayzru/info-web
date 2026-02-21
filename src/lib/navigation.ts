import {
  BookMarked,
  BookOpen,
  Calendar,
  HandHelping,
  Info,
  Map,
  Megaphone,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  testId?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  /** если true — группа отображается как прямая ссылка без выпадашки */
  direct?: boolean;
  href?: string;
  testId?: string;
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Жизнь ЖК",
    items: [
      {
        title: "Новости",
        href: "/news",
        icon: Newspaper,
        description: "Официальные новости и объявления ЖК",
        testId: "nav-news",
      },
      {
        title: "События",
        href: "/events",
        icon: Calendar,
        description: "Мероприятия, собрания, ежемесячные напоминания",
        testId: "nav-events",
      },
      {
        title: "Объявления",
        href: "/listings",
        icon: Megaphone,
        description: "Объявления жителей: продажа, аренда, услуги",
        testId: "nav-listings",
      },
    ],
  },
  {
    title: "Инфо",
    items: [
      {
        title: "Справочная",
        href: "/",
        icon: Info,
        description: "Телефоны, организации, контакты ЖК",
        testId: "nav-info",
      },
      {
        title: "Как это работает",
        href: "/howtos",
        icon: BookOpen,
        description: "Инструкции, руководства и полезные гайды",
        testId: "nav-howtos",
      },
      {
        title: "Карта",
        href: "/map",
        icon: Map,
        description: "Интерактивная карта ЖК и инфраструктуры",
        testId: "nav-map",
      },
    ],
  },
  {
    title: "Сообщество",
    items: [
      {
        title: "О проекте",
        href: "/community",
        icon: Sparkles,
        description: "Цели, история и команда платформы sr2.ru",
        testId: "nav-community-about",
      },
      {
        title: "Чаты",
        href: "/community/chats",
        icon: Users,
        description: "Ссылки на чаты строений и общий чат ЖК",
        testId: "nav-chats",
      },
      {
        title: "Правила",
        href: "/community/rules",
        icon: BookMarked,
        description: "Правила проживания и внутренний распорядок",
        testId: "nav-rules",
      },
      {
        title: "Как пользоваться",
        href: "/community/guide",
        icon: BookOpen,
        description: "Регистрация, подтверждение собственности, публикации",
        testId: "nav-community-guide",
      },
      {
        title: "Как помочь",
        href: "/community/contribute",
        icon: HandHelping,
        description: "Как поддержать развитие платформы",
        testId: "nav-community-contribute",
      },
    ],
  },
  {
    title: "Контакты",
    direct: true,
    href: "/feedback",
    testId: "nav-feedback",
    items: [],
  },
];

/** Пункты кабинета пользователя (для мобильной навигации и выпадашки) */
export const CABINET_ITEMS = [
  { title: "Мой кабинет", href: "/my", testId: "nav-cabinet" },
  { title: "Профиль", href: "/my/profile", testId: "nav-profile" },
  { title: "Уведомления", href: "/my/notifications", testId: "nav-notifications" },
  { title: "Безопасность", href: "/my/security", testId: "nav-security" },
  { title: "Недвижимость", href: "/my/property", testId: "nav-property" },
  { title: "Объявления", href: "/my/ads", testId: "nav-ads" },
] as const;
