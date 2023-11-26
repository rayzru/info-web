import { ParkingOfferInfo } from '@/types';

export default [
  {
    building: 1,
    level: -2,
    parkingNumber: 80,
    variant: 'comfort',
    contact: {
      phone: '+79526551111',
      hasTelegram: true,
      hasWhatsApp: true,
    },
    offer: {
      type: 'sell',
      price: 1100000
    }
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 130,
    variant: 'standard',
    contact: {
      phone: '+79897206553',
      hasTelegram: true,
      hasWhatsApp: true,
    },
    offer: {
      type: 'rent',
      price: 3700,
    }
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 120,
    variant: 'standard',
    contact: {
      phone: '+79198999311',
      hasWhatsApp: true,
    },
    offer: {
      type: 'rent',
      price: 4000,
      description: 'При одновременной аренде соседнего паркоместа 121, скидка 500 рублей за каждое место'
    },
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 121,
    variant: 'standard',
    contact: {
      phone: '+79198999311',
      hasWhatsApp: true,
    },
    offer: {
      type: 'rent',
      price: 4000,
      description: 'При одновременной аренде соседнего паркоместа 120, скидка 500 рублей за каждое место'
    },
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 67,
    variant: 'comfort',
    contact: {
      phone: '+79515117025',
      hasWhatsApp: true,
      hasTelegram: true,
    },
    offer: {
      type: 'rent',
      price: 3000,
    },
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 183,
    variant: 'comfort',
    contact: {
      phone: '+79515117025',
      hasWhatsApp: true,
      hasTelegram: true,
    },
    offer: {
      type: 'rent',
      price: 3000,
    },
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 19,
    variant: 'standard',
    contact: {
      phone: '+79185201981',
      hasTelegram: true,
    },
    offer: {
      type: 'rent',
      price: 3600,
      description: 'Аренда на 6 месяцев'
    },
  },
  {
    variant: 'standard',
    building: 6,
    parkingNumber: 148,
    offer: {
      type: 'rent',
      price: 3000
    },
    contact: {
      phone: '+7 (905) 450-39-06',
      hasTelegram: true,
      hasWhatsApp: true
    },
    level: -1,
    dateUpdated: 1701019163091
  }
] as ParkingOfferInfo[];
