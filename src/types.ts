import { CSSProperties } from 'react';

import { LogoType } from '@/components/Logo';
import { TagProps } from './components/search/Tag';

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
}

export interface PersonInfo extends BaseInfo {
  phones?: PhoneInfo[];
}

export interface GroupInfo extends BaseInfo {
  id: string;
  color?: CardColor;
  rows: number;
  child?: GroupInfo[];
  logo?: LogoType;
  phones?: PhoneInfo[];
  addresses?: AddressInfo[];
  persons?: PersonInfo[];
  urls?: WebsiteInfo[];
  messengers?: MessengerInfo[];
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
