import { CSSProperties } from 'react';

import { LogoType } from '@/components/Logo';
import { TagProps } from '@/components/search/Tag';

export interface PropsWithStyles {
  style?: CSSProperties;
  className?: string;
}

export type MessengerType = 'telegram' | 'whatsapp';

export enum CardColor {
  "complex" = '#880000',
  "service" = '#ff8800',
}

export interface BaseInfo {
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: TagProps[];
  visible?: boolean;
}

export interface PersonInfo extends BaseInfo {
  phones?: PhoneInfo[];
}

export interface GroupInfo extends BaseInfo {
  id: string;
  color?: CardColor;
  rows: number;
  logo?: LogoType;

  phones?: PhoneInfo[];
  addresses?: AddressInfo[];
  urls?: WebsiteInfo[];
  messengers?: MessengerInfo[];
  texts?: TextInfo[];
}

export interface IterableInfo {
  iconUrl?: string;
  onClick?: () => void;
}

export interface PhoneInfo extends BaseInfo {
  phone: string;
  hasWhatsApp?: boolean;
  hasTelegram?: boolean;
}

export interface WebsiteInfo extends BaseInfo {
  url: string;
}

export interface MessengerInfo extends BaseInfo {
  messengerType: MessengerType;
  link: string;
}

export interface TextInfo extends BaseInfo {
  text: string;
}

export interface AddressInfo extends BaseInfo {
  postcode?: number;
  city?: string;
  address: string;
  floor?: number;
  office?: string | number;
  lnglat: [number, number],
  maps: string[];
}

export type IconType =
  | 'geo'
  | 'phone'
  | 'chat'
  | 'copy'
  | 'yandex-maps'
  | 'telegram'
  | 'whatsapp'
  | 'share'
  | 'arrow-up'
  | 'link';


export interface ParkingOfferInfo extends BaseInfo {
  building: Building;
  level?: ParkingLevel;
  variant: ParkingVariant;
  offer: Offer;
  contact: PhoneInfo;
  dateUpdated?: number;
  parkingNumber: number;
  visible?: boolean;
}

export type ParkingVariant = 'comfort' | 'standard';
export type ParkingLevel = -1 | -2;
export type Building = 1 | 2 | 6 | 7;

export interface Offer {
  type: 'rent' | 'sell';
  price?: number;
  perTimeRange: 'year' | 'month' | 'week' | 'once';
  description: string;
}
