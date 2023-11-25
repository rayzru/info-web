import { ParkingOfferInfo } from '@/types';

export default [
  {
    building: 1,
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
        price: 3700,
      }
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 120,
    variant: 'regular',
    phones: [
      {
        phone: '+79198999311',
        hasWhatsApp: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 4000,
        description: 'При одновременной аренде соседнего паркоместа 121, скидка 500 рублей за каждое место'
      },
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 121,
    variant: 'regular',
    phones: [
      {
        phone: '+79198999311',
        hasWhatsApp: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 4000,
        description: 'При одновременной аренде соседнего паркоместа 120, скидка 500 рублей за каждое место'
      },
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 67,
    variant: 'comfort',
    phones: [
      {
        phone: '+79515117025',
        hasWhatsApp: true,
        hasTelegram: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 3000,
      },
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 183,
    variant: 'comfort',
    phones: [
      {
        phone: '+79515117025',
        hasWhatsApp: true,
        hasTelegram: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 3000,
      },
    ]
  },
  {
    building: 6,
    level: -1,
    parkingNumber: 19,
    variant: 'regular',
    phones: [
      {
        phone: '+79185201981',
        hasTelegram: true,
      }
    ],
    offers: [
      {
        type: 'rent',
        price: 3600,
        description: 'Аренда на 6 месяцев'
      },
    ]
  },
] as ParkingOfferInfo[];
