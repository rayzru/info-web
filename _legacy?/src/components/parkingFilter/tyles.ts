import { ParkingOfferInfo } from '@/types';

export interface ParkingFilters {
  type: string[];
  buildings: string[];
}

// eslint-disable-next-line no-unused-vars
export type FilterFn = (el: ParkingOfferInfo) => boolean;
// eslint-disable-next-line no-unused-vars
export type OverlayFn = (overlay: boolean) => void;
