import { CSSProperties } from 'react';

import { LogoType } from '@/components/card/Logo';

export interface PropsWithStyles {
  style?: CSSProperties;
  className?: string;
}


export type MessengerType = 'telegram' | 'whatsapp';

type ServiceTag = 'urgent' | 'regular' | 'administrative' | 'secondary';
type InfoTypeTag = 'phone' | 'address' | 'name';
type Tag = ServiceTag | InfoTypeTag;

export enum CardColor {
  white = 'white',
  red = '#ffeeee',
}

export interface BaseInfo {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: Tag[];
}

export interface PersonInfo extends BaseInfo {
  phones?: PhoneInfo[];
}

export interface GroupInfo extends BaseInfo {
  id: string;
  color: CardColor;
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
  mesengerType: MessengerType;
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