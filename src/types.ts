// Legacy types for /data/index.ts compatibility
// These types support the old static data format

export type PhoneInfo = {
  title: string;
  subtitle?: string;
  phone: string;
  hasWhatsApp?: boolean;
  hasTelegram?: boolean;
  tags?: string;
};

export type AddressInfo = {
  title?: string;
  city?: string;
  address: string;
  floor?: number;
  office?: string;
  postcode?: number;
  lnglat?: [number, number];
  maps?: string[];
};

export type UrlInfo = {
  title: string;
  subtitle?: string;
  url: string;
};

export type MessengerInfo = {
  title: string;
  subtitle?: string;
  messengerType: "telegram" | "whatsapp" | "vk";
  link: string;
};

export type TextInfo = {
  title: string;
  text: string;
};

export type GroupInfo = {
  id: string;
  rows: number;
  title: string;
  subtitle?: string;
  logo?: string;
  addresses?: AddressInfo[];
  phones?: PhoneInfo[];
  urls?: UrlInfo[];
  messengers?: MessengerInfo[];
  texts?: TextInfo[];
  tags?: string[];
};
