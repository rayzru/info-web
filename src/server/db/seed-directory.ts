import { db } from "./index";
import {
  directoryTags,
  directoryEntries,
  directoryContacts,
  directorySchedules,
  directoryEntryTags,
  directoryContactTags,
  buildings,
  buildingChannels,
} from "./schema";

/**
 * Seed script for directory справочной системы ЖК Сердце Ростова 2
 *
 * Uses REAL data from data/index.ts
 *
 * Архитектура scopes:
 * - core: ЖК инфраструктура (УК, здания, коммуникации)
 * - commerce: арендаторы на территории ЖК
 * - city: городская инфраструктура (больницы, полиция)
 * - promoted: рекламные размещения (будущее)
 */

// ============== TAG HIERARCHY ==============

type TagDefinition = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  scope: "core" | "commerce" | "city" | "promoted";
  synonyms?: string[];
  icon?: string;
  order: number;
};

const TAGS: TagDefinition[] = [
  // ===== CORE SCOPE (ЖК) =====
  {
    id: "tag-uk",
    name: "Управляющая компания",
    slug: "uk",
    description: "Управляющая компания и её службы",
    scope: "core",
    synonyms: ["УК", "управление", "управдом"],
    icon: "Users",
    order: 1,
  },
  {
    id: "tag-emergency",
    name: "Аварийные службы",
    slug: "emergency",
    description: "Экстренные контакты и аварийные службы",
    scope: "core",
    synonyms: ["авария", "экстренно", "срочно", "поломка", "электрик", "сантехник"],
    icon: "AlertTriangle",
    order: 2,
  },
  {
    id: "tag-buildings",
    name: "Корпуса",
    slug: "buildings",
    description: "Корпуса и строения ЖК",
    scope: "core",
    synonyms: ["корпус", "дом", "строение", "литер"],
    icon: "Building",
    order: 3,
  },
  {
    id: "tag-utilities",
    name: "Коммуналка",
    slug: "utilities",
    description: "ЖКХ и ресурсоснабжающие организации",
    scope: "core",
    synonyms: ["ЖКХ", "коммуналка", "ресурсы", "счётчики", "показания"],
    icon: "Wrench",
    order: 4,
  },
  {
    id: "tag-internet",
    name: "Интернет",
    slug: "internet",
    description: "Интернет-провайдеры",
    scope: "commerce",
    synonyms: ["провайдер", "WiFi", "интернет"],
    icon: "Wifi",
    order: 5,
  },
  {
    id: "tag-medical",
    name: "Медицина",
    slug: "medical",
    description: "Поликлиники, больницы",
    scope: "city",
    synonyms: ["врач", "поликлиника", "больница", "медицина"],
    icon: "Heart",
    order: 6,
  },
  {
    id: "tag-developer",
    name: "Застройщик",
    slug: "developer",
    description: "МСК и гарантийные вопросы",
    scope: "core",
    synonyms: ["МСК", "застройщик", "гарантия"],
    icon: "HardHat",
    order: 7,
  },
  // ===== CONTACT-LEVEL TAGS (для поиска конкретных контактов) =====
  {
    id: "tag-konsierzh",
    name: "Консьерж",
    slug: "konsierzh",
    description: "Телефоны консьержей",
    scope: "core",
    synonyms: ["консьержка", "охрана", "вахта"],
    icon: "UserCheck",
    order: 100,
  },
  {
    id: "tag-chat",
    name: "Чат",
    slug: "chat",
    description: "Telegram-чаты",
    scope: "core",
    synonyms: ["телеграм", "telegram", "чат", "группа"],
    icon: "MessageCircle",
    order: 101,
  },
  {
    id: "tag-elektrik",
    name: "Электрик",
    slug: "elektrik",
    description: "Электрики",
    scope: "core",
    synonyms: ["электрика", "свет", "электричество"],
    icon: "Zap",
    order: 102,
  },
  {
    id: "tag-santehnik",
    name: "Сантехник",
    slug: "santehnik",
    description: "Сантехники",
    scope: "core",
    synonyms: ["сантехника", "вода", "трубы", "канализация"],
    icon: "Droplet",
    order: 103,
  },
  {
    id: "tag-dispetcher",
    name: "Диспетчерская",
    slug: "dispetcher",
    description: "Диспетчерские службы",
    scope: "core",
    synonyms: ["диспетчер", "оператор"],
    icon: "Headphones",
    order: 104,
  },
  {
    id: "tag-lift",
    name: "Лифт",
    slug: "lift",
    description: "Лифтовая служба",
    scope: "core",
    synonyms: ["лифт", "подъемник"],
    icon: "ArrowUpDown",
    order: 105,
  },
  {
    id: "tag-domofon",
    name: "Домофон",
    slug: "domofon",
    description: "Домофонная служба",
    scope: "core",
    synonyms: ["домофон", "интерком", "видеодомофон"],
    icon: "DoorOpen",
    order: 106,
  },
  {
    id: "tag-vorota",
    name: "Ворота",
    slug: "vorota",
    description: "Ворота и шлагбаумы",
    scope: "core",
    synonyms: ["ворота", "шлагбаум", "въезд"],
    icon: "DoorClosed",
    order: 107,
  },
  {
    id: "tag-address",
    name: "Адрес",
    slug: "address",
    description: "Адреса",
    scope: "core",
    synonyms: ["адрес", "местоположение"],
    icon: "MapPin",
    order: 108,
  },
  // Building-specific tags (для поиска по строениям)
  {
    id: "tag-stroenie-1",
    name: "Строение 1",
    slug: "stroenie-1",
    description: "Строение 1 (литеры 4, 5)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 1", "литер 4", "литер 5"],
    icon: "Building",
    order: 110,
  },
  {
    id: "tag-stroenie-2",
    name: "Строение 2",
    slug: "stroenie-2",
    description: "Строение 2 (литеры 2, 3)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 2", "литер 2", "литер 3"],
    icon: "Building",
    order: 111,
  },
  {
    id: "tag-stroenie-3",
    name: "Строение 3",
    slug: "stroenie-3",
    description: "Строение 3 (литер 9)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 3", "литер 9"],
    icon: "Building",
    order: 112,
  },
  {
    id: "tag-stroenie-4",
    name: "Строение 4",
    slug: "stroenie-4",
    description: "Строение 4 (литер 1)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 4", "литер 1"],
    icon: "Building",
    order: 113,
  },
  {
    id: "tag-stroenie-5",
    name: "Строение 5",
    slug: "stroenie-5",
    description: "Строение 5 (литеры 6, 7)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 5", "литер 6", "литер 7"],
    icon: "Building",
    order: 114,
  },
  {
    id: "tag-stroenie-6",
    name: "Строение 6",
    slug: "stroenie-6",
    description: "Строение 6 (литеры 10, 11)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 6", "литер 10", "литер 11"],
    icon: "Building",
    order: 115,
  },
  {
    id: "tag-stroenie-7",
    name: "Строение 7",
    slug: "stroenie-7",
    description: "Строение 7 (литер 8)",
    parentId: "tag-buildings",
    scope: "core",
    synonyms: ["строение 7", "литер 8"],
    icon: "Building",
    order: 116,
  },
  // Entrance tags (для поиска по подъездам)
  {
    id: "tag-podezd-1",
    name: "Подъезд 1",
    slug: "podezd-1",
    description: "Первый подъезд",
    scope: "core",
    synonyms: ["подъезд 1", "п1", "первый подъезд"],
    icon: "DoorOpen",
    order: 120,
  },
  {
    id: "tag-podezd-2",
    name: "Подъезд 2",
    slug: "podezd-2",
    description: "Второй подъезд",
    scope: "core",
    synonyms: ["подъезд 2", "п2", "второй подъезд"],
    icon: "DoorOpen",
    order: 121,
  },
];

// ============== ENTRY DATA (from data/index.ts) ==============

type ContactDef = {
  type: "phone" | "email" | "address" | "telegram" | "whatsapp" | "website" | "vk" | "other";
  value: string;
  label?: string;
  subtitle?: string;
  isPrimary?: boolean;
  hasWhatsApp?: boolean;
  hasTelegram?: boolean;
  is24h?: boolean;
  scheduleNote?: string;
  tagIds?: string[]; // Tags for this specific contact
};

type EntryDefinition = {
  slug: string;
  type: "contact" | "organization" | "location" | "document";
  title: string;
  description?: string;
  content?: string;
  icon?: string;
  order: number;
  contacts: ContactDef[];
  tagIds: string[];
  buildingNumber?: number; // For linking to building table
  telegramChannel?: string; // For building_channels
};

const ENTRIES: EntryDefinition[] = [
  // ===== УК Сердце Ростова =====
  {
    slug: "uk-serdtse-rostova",
    type: "organization",
    title: "Управляющая компания Сердце Ростова",
    description: "УК ЖК Сердце Ростова 2",
    icon: "Users",
    order: 1,
    contacts: [
      { type: "phone", value: "+7 (960) 448-08-18", label: "Диспетчерcкая УК", isPrimary: true, hasWhatsApp: true, is24h: true, tagIds: ["tag-dispetcher"] },
      { type: "phone", value: "+7 (906) 453-40-97", label: "Начальник участка", subtitle: "Соболев Александр Сергеевич", hasWhatsApp: true, hasTelegram: true },
      { type: "phone", value: "+7 (905) 478-77-83", label: "Мастер участка", subtitle: "Алина Гамзатхановна Гаджиева" },
      { type: "phone", value: "+7 (905) 429-09-92", label: "Технический директор", subtitle: "Андрей Вадимович", hasWhatsApp: true },
      { type: "phone", value: "+7 (960) 461-44-60", label: "Директор по работе с населением", subtitle: "Сергей Григорьевич Сагиров", hasWhatsApp: true },
      { type: "phone", value: "+7 (960) 448-58-08", label: "Директор", subtitle: "Анжела Анатольевна Башкирова", hasWhatsApp: true },
      { type: "phone", value: "+7 (903) 403-09-30", label: "Расчетный отдел", subtitle: "Бухгалтерия", hasWhatsApp: true, scheduleNote: "Пн-Пт 9:00-18:00" },
      { type: "address", value: "г. Ростов-на-Дону, пр. Михаила Нагибина, 33а/47, этаж 3, офис 306", tagIds: ["tag-address"] },
      { type: "website", value: "https://uk-sr.ru/", label: "Официальный сайт" },
    ],
    tagIds: ["tag-uk"],
  },

  // ===== АВАРИЙНЫЕ СЛУЖБЫ =====
  {
    slug: "avariynye-sluzhby",
    type: "contact",
    title: "Аварийные службы СР2",
    description: "Круглосуточные аварийные службы ЖК",
    icon: "AlertTriangle",
    order: 2,
    contacts: [
      { type: "phone", value: "+7 (960) 448-00-98", label: "Аварийно-диспетчерская служба", isPrimary: true, is24h: true, tagIds: ["tag-dispetcher"] },
      { type: "phone", value: "+7 (961) 435-56-59", label: "Электрик", subtitle: "Андрей Сергеевич", is24h: true, tagIds: ["tag-elektrik"] },
      { type: "phone", value: "+7 (908) 194-24-08", label: "Электрик", subtitle: "Тагир", is24h: true, tagIds: ["tag-elektrik"] },
      { type: "phone", value: "+7 (938) 155-22-37", label: "Сантехник", subtitle: "Андрей Юрьевич", is24h: true, tagIds: ["tag-santehnik"] },
      { type: "phone", value: "+7 (961) 402-84-63", label: "Сантехник", subtitle: "Михаил Евгеньевич", is24h: true, tagIds: ["tag-santehnik"] },
      { type: "phone", value: "+7 (952) 415-21-95", label: "Сантехник", subtitle: "Михаил", is24h: true, tagIds: ["tag-santehnik"] },
      { type: "phone", value: "+7 (908) 506-57-16", label: "Сантехник", subtitle: "Анатолий", is24h: true, tagIds: ["tag-santehnik"] },
      { type: "phone", value: "+7 (989) 518-97-37", label: "Тепловой пункт", subtitle: "ИП Малов С.А.", is24h: true, tagIds: ["tag-santehnik"] },
      { type: "phone", value: "+7 (928) 152-12-12", label: "Застройщик - ООО МСК-СТРОЙ", subtitle: "Прораб Стрекалов Игорь" },
      { type: "phone", value: "+7 (863) 297-56-01", label: "Ворота", subtitle: "ООО ГостСервис", tagIds: ["tag-vorota"] },
      { type: "phone", value: "+7 (928) 296-31-49", label: "Домофон", subtitle: "ООО ПрофДелоДон", tagIds: ["tag-domofon"] },
      { type: "phone", value: "+7 (928) 296-31-49", label: "Лифтовая диспетчерская", subtitle: "ООО ЮгЛифтСервис", is24h: true, tagIds: ["tag-lift"] },
      { type: "telegram", value: "https://t.me/serdcerostova2", label: "Telegram - Общий чат", tagIds: ["tag-chat"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, 45", tagIds: ["tag-address"] },
    ],
    tagIds: ["tag-emergency"],
    telegramChannel: "https://t.me/serdcerostova2",
  },

  // ===== ЗДАНИЯ (Строения 1-7) =====
  {
    slug: "stroenie-1",
    type: "location",
    title: "Строение 1",
    description: "Литеры 4, 5",
    icon: "Building",
    order: 10,
    buildingNumber: 1,
    contacts: [
      { type: "phone", value: "+7 (960) 461-44-24", label: "Консьерж - подъезд 1", tagIds: ["tag-konsierzh", "tag-stroenie-1", "tag-podezd-1"] },
      { type: "phone", value: "+7 (960) 461-44-25", label: "Консьерж - подъезд 2", tagIds: ["tag-konsierzh", "tag-stroenie-1", "tag-podezd-2"] },
      { type: "telegram", value: "https://t.me/sr2_s1", label: "Telegram - Строение 1", tagIds: ["tag-chat", "tag-stroenie-1"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 1", tagIds: ["tag-address", "tag-stroenie-1"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-1"],
    telegramChannel: "https://t.me/sr2_s1",
  },
  {
    slug: "stroenie-2",
    type: "location",
    title: "Строение 2",
    description: "Литеры 2, 3",
    icon: "Building",
    order: 11,
    buildingNumber: 2,
    contacts: [
      { type: "phone", value: "+7 (960) 461-44-21", label: "Консьерж - подъезд 1", tagIds: ["tag-konsierzh", "tag-stroenie-2", "tag-podezd-1"] },
      { type: "phone", value: "+7 (960) 461-44-32", label: "Консьерж - подъезд 2", tagIds: ["tag-konsierzh", "tag-stroenie-2", "tag-podezd-2"] },
      { type: "telegram", value: "https://t.me/sr2_s2", label: "Telegram - Строение 2", tagIds: ["tag-chat", "tag-stroenie-2"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 2", tagIds: ["tag-address", "tag-stroenie-2"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-2"],
    telegramChannel: "https://t.me/sr2_s2",
  },
  {
    slug: "stroenie-3",
    type: "location",
    title: "Строение 3",
    description: "Литер 9",
    icon: "Building",
    order: 12,
    buildingNumber: 3,
    contacts: [
      { type: "telegram", value: "https://t.me/sr2_s3", label: "Telegram - Строение 3", tagIds: ["tag-chat", "tag-stroenie-3"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 3", tagIds: ["tag-address", "tag-stroenie-3"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-3"],
    telegramChannel: "https://t.me/sr2_s3",
  },
  {
    slug: "stroenie-4",
    type: "location",
    title: "Строение 4",
    description: "Литер 1",
    icon: "Building",
    order: 13,
    buildingNumber: 4,
    contacts: [
      { type: "telegram", value: "https://t.me/sr2_s4", label: "Telegram - Строение 4", tagIds: ["tag-chat", "tag-stroenie-4"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 4", tagIds: ["tag-address", "tag-stroenie-4"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-4"],
    telegramChannel: "https://t.me/sr2_s4",
  },
  {
    slug: "stroenie-5",
    type: "location",
    title: "Строение 5",
    description: "Литер 8",
    icon: "Building",
    order: 14,
    buildingNumber: 5,
    contacts: [
      { type: "telegram", value: "https://t.me/sr2_s5", label: "Telegram - Строение 5", tagIds: ["tag-chat", "tag-stroenie-5"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 5", tagIds: ["tag-address", "tag-stroenie-5"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-5"],
    telegramChannel: "https://t.me/sr2_s5",
  },
  {
    slug: "stroenie-6",
    type: "location",
    title: "Строение 6",
    description: "Литер 7",
    icon: "Building",
    order: 15,
    buildingNumber: 6,
    contacts: [
      { type: "phone", value: "+7 (906) 425-93-86", label: "Консьерж - подъезд 1", tagIds: ["tag-konsierzh", "tag-stroenie-6", "tag-podezd-1"] },
      { type: "phone", value: "+7 (906) 425-94-39", label: "Консьерж - подъезд 2", tagIds: ["tag-konsierzh", "tag-stroenie-6", "tag-podezd-2"] },
      { type: "telegram", value: "https://t.me/sr2_s6", label: "Telegram - Строение 6", tagIds: ["tag-chat", "tag-stroenie-6"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 6", tagIds: ["tag-address", "tag-stroenie-6"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-6"],
    telegramChannel: "https://t.me/sr2_s6",
  },
  {
    slug: "stroenie-7",
    type: "location",
    title: "Строение 7",
    description: "Литер 6",
    icon: "Building",
    order: 16,
    buildingNumber: 7,
    contacts: [
      { type: "phone", value: "+7 (905) 478-78-21", label: "Консьерж - подъезд 1", tagIds: ["tag-konsierzh", "tag-stroenie-7", "tag-podezd-1"] },
      { type: "phone", value: "+7 (905) 478-78-27", label: "Консьерж - подъезд 2", tagIds: ["tag-konsierzh", "tag-stroenie-7", "tag-podezd-2"] },
      { type: "telegram", value: "https://t.me/sr2_s7", label: "Telegram - Строение 7", tagIds: ["tag-chat", "tag-stroenie-7"] },
      { type: "address", value: "г. Ростов-на-Дону, ул. Ларина, д.45, строение 7", tagIds: ["tag-address", "tag-stroenie-7"] },
    ],
    tagIds: ["tag-buildings", "tag-stroenie-7"],
    telegramChannel: "https://t.me/sr2_s7",
  },

  // ===== ЗАСТРОЙЩИК МСК =====
  {
    slug: "msk-developer",
    type: "organization",
    title: "Застройщик МСК",
    description: "Московская строительная компания",
    icon: "HardHat",
    order: 20,
    contacts: [
      { type: "phone", value: "+7 800 777-75-77", label: "Горячая линия", isPrimary: true },
      { type: "phone", value: "+7 (938) 175-44-81", label: "Гарантийный отдел", subtitle: "Елена Юкина", hasWhatsApp: true, scheduleNote: "Пн-Пт 9:00-18:00" },
      { type: "phone", value: "+7 (928) 152-12-12", label: "Дежурный прораб", subtitle: "Игорь Стрекалов", hasWhatsApp: true },
      { type: "address", value: "г. Ростов-на-Дону, пер. Доломановский, 70д, этаж 5", tagIds: ["tag-address"] },
      { type: "website", value: "https://msk-development.ru/projects/flats/serdce-rostova2", label: "Официальный сайт" },
      { type: "website", value: "https://forms.gle/umA7WHfsSs1HD6CV6", label: "Заявка на гарантийные работы" },
      { type: "whatsapp", value: "https://wa.me/+79188500955", label: "Официальный WhatsApp чат", tagIds: ["tag-chat"] },
      { type: "telegram", value: "https://t.me/msk_development", label: "Официальный Telegram чат", tagIds: ["tag-chat"] },
    ],
    tagIds: ["tag-developer"],
  },

  // ===== СЛУЖБЫ ЖКХ =====
  {
    slug: "zhkh-services",
    type: "contact",
    title: "Службы ЖКХ",
    description: "Ресурсы и службы ЖКХ",
    icon: "Wrench",
    order: 25,
    contacts: [
      { type: "website", value: "https://xn--80aaaf3bi1ahsd.xn--80asehdb/", label: "Квартплата.Онлайн", subtitle: "Регистрации показаний и оплата" },
      { type: "website", value: "https://play.google.com/store/apps/details?id=ru.sigma.gisgkh", label: "Госуслуги.Дом - Android" },
      { type: "website", value: "https://apps.apple.com/ru/app/%D0%B3%D0%BE%D1%81%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8-%D0%B4%D0%BE%D0%BC/id1616550510", label: "Госуслуги.Дом - iOS" },
    ],
    tagIds: ["tag-utilities"],
  },

  // ===== ДОМОФОНЫ VDome =====
  {
    slug: "domofon-vdome",
    type: "organization",
    title: "Домофоны VDome",
    description: "VDome",
    icon: "Shield",
    order: 30,
    contacts: [
      { type: "phone", value: "+7 (863) 310-02-26", label: "Диспетчерская", isPrimary: true, tagIds: ["tag-domofon", "tag-dispetcher"] },
      { type: "whatsapp", value: "https://wa.me/+79963530117?text=инструкция", label: "WhatsApp робот", subtitle: "Регистрация, инструкция", tagIds: ["tag-domofon"] },
      { type: "website", value: "https://play.google.com/store/apps/details?id=ru.mts.vdome.resident", label: "Приложение для Android", tagIds: ["tag-domofon"] },
      { type: "website", value: "https://apps.apple.com/ru/app/vdome/id1491163759", label: "Приложение для iOS", tagIds: ["tag-domofon"] },
    ],
    tagIds: ["tag-utilities", "tag-domofon"],
  },

  // ===== ВОДОКАНАЛ =====
  {
    slug: "vodokanal",
    type: "organization",
    title: "Водоканал",
    description: "Водоснабжение",
    icon: "Droplets",
    order: 31,
    contacts: [
      { type: "phone", value: "+7 (863) 309-09-09", label: "Передача показаний счетчиков", isPrimary: true },
      { type: "website", value: "https://lkfl.vodokanalrnd.ru/", label: "Личный кабинет" },
    ],
    tagIds: ["tag-utilities"],
  },

  // ===== ТНС-ЭНЕРГО =====
  {
    slug: "tns-energo",
    type: "organization",
    title: "ТНС-Энерго",
    description: "Электричество",
    icon: "Zap",
    order: 32,
    contacts: [
      { type: "website", value: "https://lk.rostov.tns-e.ru/", label: "Личный кабинет", isPrimary: true },
    ],
    tagIds: ["tag-utilities"],
  },

  // ===== ЧИСТЫЙ ГОРОД =====
  {
    slug: "clean-city",
    type: "organization",
    title: "Чистый город",
    description: "ТКО",
    icon: "Trash2",
    order: 33,
    contacts: [
      { type: "phone", value: "8-800-707-05-08", label: "Горячая линия", isPrimary: true },
      { type: "address", value: "просп. Михаила Нагибина, д.27" },
      { type: "website", value: "https://rostov.clean-rf.ru/", label: "Официальный сайт" },
    ],
    tagIds: ["tag-utilities"],
  },

  // ===== ТЕПЛОСЕРВИС ЮГ =====
  {
    slug: "teploservice-ug",
    type: "organization",
    title: "ТеплоСервис Юг",
    description: "Отопление и горячая вода",
    icon: "Flame",
    order: 34,
    contacts: [
      { type: "phone", value: "+7 (928) 110-06-86", label: "Аварийная служба", isPrimary: true, is24h: true },
      { type: "website", value: "https://ts-ug.ru/", label: "Официальный сайт" },
      { type: "whatsapp", value: "https://wa.me/+79381009510", label: "WhatsApp, подать показания" },
    ],
    tagIds: ["tag-utilities"],
  },

  // ===== ИНТЕРНЕТ ПРОВАЙДЕРЫ =====
  {
    slug: "domru",
    type: "organization",
    title: "дом.ру",
    description: "Интернет-провайдер",
    icon: "Wifi",
    order: 40,
    contacts: [
      { type: "phone", value: "+7 (863) 307-50-01", label: "Техническая поддержка", isPrimary: true },
      { type: "website", value: "https://dealers.dom.ru/request/widget?domain=rostov&referral_id=1000181217", label: "Подключение (строения 1, 2)", subtitle: "В домах введено оборудование" },
      { type: "website", value: "https://forms.gle/FHVGqTtvkTWVWNfJ6", label: "Предварительная заявка (строения 3-9)", subtitle: "Дома планируется подключить" },
      { type: "website", value: "https://rostov.dom.ru/", label: "Официальный сайт" },
    ],
    tagIds: ["tag-internet"],
  },
  {
    slug: "beeline",
    type: "organization",
    title: "билайн",
    description: "Интернет-провайдер",
    icon: "Wifi",
    order: 41,
    contacts: [
      { type: "phone", value: "8 (800) 700 8000", label: "Горячая линия", isPrimary: true },
      { type: "website", value: "https://forms.gle/oQhTbvd7WKMaKVub6", label: "Заявка на подключение онлайн" },
      { type: "website", value: "https://rostov-na-donu.beeline.ru/customers/products/home/internet/", label: "Официальный сайт" },
    ],
    tagIds: ["tag-internet"],
  },
  {
    slug: "orbita",
    type: "organization",
    title: "Орбита",
    description: "Интернет-провайдер",
    icon: "Wifi",
    order: 42,
    contacts: [
      { type: "phone", value: "+7 (863) 318-0-318", label: "Техническая поддержка", isPrimary: true },
      { type: "website", value: "https://orbitanov.ru/rostov/", label: "Тарифы, подключение" },
    ],
    tagIds: ["tag-internet"],
  },

  // ===== ПОЛИКЛИНИКА =====
  {
    slug: "poliklinika-5",
    type: "organization",
    title: "Поликлиника № 5",
    description: "Медицинское учреждение",
    icon: "Heart",
    order: 50,
    contacts: [
      { type: "phone", value: "+7 (961) 277-66-07", label: "Неотложная помощь", isPrimary: true, is24h: true },
      { type: "phone", value: "+7 (938) 181-76-06", label: "Колл-центр" },
      { type: "phone", value: "+7 (863) 243-64-11", label: "Регистратура", subtitle: "Взрослая поликлиника" },
      { type: "phone", value: "+7 (863) 243-65-77", label: "Терапевтическое отделение №2" },
      { type: "phone", value: "+7 (928) 212-09-52", label: "Женская консультация" },
      { type: "phone", value: "+7 (863) 243-68-66", label: "Регистратура", subtitle: "Детская поликлиника" },
      { type: "phone", value: "+7 (906) 429-28-33", label: "Педиатрическое отделение №2" },
      { type: "address", value: "Оренбургский переулок, 22/1" },
      { type: "website", value: "https://www.policlinic5.ru", label: "Официальный сайт" },
    ],
    tagIds: ["tag-medical"],
  },

  // ===== ГОРОДСКИЕ СЛУЖБЫ =====
  {
    slug: "gorodskie-sluzhby",
    type: "contact",
    title: "Городские службы",
    description: "Ростов-на-Дону",
    icon: "Landmark",
    order: 60,
    contacts: [
      { type: "phone", value: "+7 (999) 471-07-53", label: "Участковый", subtitle: "Возняк Александр Сергеевич" },
      { type: "phone", value: "+7 (863) 277-77-07", label: "Дежурная часть ГАИ", is24h: true },
      { type: "phone", value: "+7 (863) 249-42-77", label: "Диспетчер ГАИ", is24h: true },
    ],
    tagIds: ["tag-emergency"],
  },
];

async function seedDirectory() {
  console.log("🌱 Seeding directory for ЖК Сердце Ростова 2...");

  try {
    // Get building IDs for linking
    console.log("🏢 Fetching buildings...");
    const allBuildings = await db.select().from(buildings);
    const buildingMap = new Map<number, string>();
    for (const b of allBuildings) {
      if (b.number) {
        buildingMap.set(b.number, b.id);
      }
    }
    console.log(`  ✓ Found ${buildingMap.size} buildings`);

    // Clear existing data
    console.log("🧹 Clearing existing directory data...");
    await db.delete(directoryContactTags);
    await db.delete(directoryEntryTags);
    await db.delete(directoryContacts);
    await db.delete(directorySchedules);
    await db.delete(directoryEntries);
    await db.delete(directoryTags);
    await db.delete(buildingChannels);

    // Insert tags
    console.log("📁 Inserting tags...");
    for (const tag of TAGS) {
      await db.insert(directoryTags).values({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        parentId: tag.parentId ?? null,
        scope: tag.scope,
        synonyms: tag.synonyms ? JSON.stringify(tag.synonyms) : null,
        icon: tag.icon,
        order: tag.order,
      });
    }
    console.log(`  ✓ Inserted ${TAGS.length} tags`);

    // Insert entries with contacts and tags
    console.log("📝 Inserting entries...");
    let contactsCount = 0;
    let contactTagsCount = 0;
    let channelsCount = 0;

    for (const entry of ENTRIES) {
      const entryId = crypto.randomUUID();
      const buildingId = entry.buildingNumber ? buildingMap.get(entry.buildingNumber) : null;

      // Insert entry
      await db.insert(directoryEntries).values({
        id: entryId,
        slug: entry.slug,
        type: entry.type,
        title: entry.title,
        description: entry.description,
        content: entry.content,
        buildingId: buildingId ?? null,
        icon: entry.icon,
        order: entry.order,
        isActive: 1,
      });

      // Insert contacts with new fields and contact-level tags
      for (let i = 0; i < entry.contacts.length; i++) {
        const contact = entry.contacts[i]!;
        const contactId = crypto.randomUUID();

        await db.insert(directoryContacts).values({
          id: contactId,
          entryId,
          type: contact.type,
          value: contact.value,
          label: contact.label,
          subtitle: contact.subtitle,
          isPrimary: contact.isPrimary ? 1 : 0,
          order: i,
          hasWhatsApp: contact.hasWhatsApp ? 1 : 0,
          hasTelegram: contact.hasTelegram ? 1 : 0,
          is24h: contact.is24h ? 1 : 0,
          scheduleNote: contact.scheduleNote,
        });
        contactsCount++;

        // Insert contact-tag relations
        if (contact.tagIds) {
          for (const tagId of contact.tagIds) {
            await db.insert(directoryContactTags).values({
              contactId,
              tagId,
            });
            contactTagsCount++;
          }
        }
      }

      // Insert entry-tag relations
      for (const tagId of entry.tagIds) {
        await db.insert(directoryEntryTags).values({
          entryId,
          tagId,
        });
      }

      // Insert building channel for system notifications
      if (buildingId && entry.telegramChannel) {
        await db.insert(buildingChannels).values({
          id: crypto.randomUUID(),
          buildingId,
          channelType: "telegram",
          channelId: entry.telegramChannel,
          name: `Telegram ${entry.title}`,
          isActive: 1,
          isPrimary: 1,
        });
        channelsCount++;
      }
    }

    // Insert general complex channel (no building)
    const generalEntry = ENTRIES.find((e) => e.slug === "avariynye-sluzhby");
    if (generalEntry?.telegramChannel) {
      await db.insert(buildingChannels).values({
        id: crypto.randomUUID(),
        buildingId: null, // General channel for whole complex
        channelType: "telegram",
        channelId: generalEntry.telegramChannel,
        name: "Общий чат ЖК Сердце Ростова 2",
        isActive: 1,
        isPrimary: 1,
      });
      channelsCount++;
    }

    console.log(`  ✓ Inserted ${ENTRIES.length} entries`);
    console.log(`  ✓ Inserted ${contactsCount} contacts`);
    console.log(`  ✓ Inserted ${contactTagsCount} contact-tag relations`);
    console.log(`  ✓ Inserted ${channelsCount} building channels`);

    console.log("\n✅ Directory seeding complete!");
    console.log("");
    console.log("📊 Summary:");
    console.log(`  • ${TAGS.length} tags`);
    console.log(`  • ${ENTRIES.length} directory entries`);
    console.log(`  • ${contactsCount} contacts (phones, addresses, urls, messengers)`);
    console.log(`  • ${contactTagsCount} contact-tag relations (for granular search)`);
    console.log(`  • ${channelsCount} building channels (for system notifications)`);
  } catch (error) {
    console.error("❌ Error seeding directory:", error);
    throw error;
  }

  process.exit(0);
}

seedDirectory();
