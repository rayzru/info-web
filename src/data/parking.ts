import { ParkingOfferInfo } from '@/types';

export default [
  {
    building: 2,
    level: -2,
    parkingNumber: 80,
    variant: 'comfort',
    phones: [
      {
        phone: '+79526551111',
        hasTelegram: true,
        hasWhatsApp: true,
      }
    ],
    offers: [
      {
        type: 'sell',
        price: 1100000
      }
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 130,
    variant: 'regular',
    phones: [
      {
        phone: '+79897206553',
        hasTelegram: true,
        hasWhatsApp: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 3000
      }
    ]
  },
] as ParkingOfferInfo[];
