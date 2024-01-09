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
      price: 950000
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
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 31,
    offer: {
      type: 'rent',
      price: 5000
    },
    contact: {
      hasTelegram: true,
      phone: '+7 (989) 502-60-97'
    },
    dateUpdated: 1701175341351
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 42,
    offer: {
      type: 'rent',
      price: 6000,
      description: 'Удобное место рядом с лифтом'
    },
    contact: {
      phone: '+7 (989) 637-97-19',
      hasTelegram: true,
      hasWhatsApp: true
    },
    dateUpdated: 1701252401509
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 61,
    offer: {
      type: 'rent',
      price: 4000
    },
    contact: {
      phone: '+8 (900) 136-21-11'
    },
    dateUpdated: 1701879650097
  },
  {
    variant: 'standard',
    level: -1,
    offer: {
      type: 'rent',
      price: 4000,
      description: 'Рядом с лифтом'
    },
    contact: {
      phone: '+7 (926) 611-42-28',
      hasTelegram: true,
      hasWhatsApp: true
    },
    building: 6,
    parkingNumber: 168,
    dateUpdated: 1702397342913
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 42,
    offer: {
      type: 'sell',
      price: 1050000,
    },
    contact: {
      phone: '+7(989)6379719',
      hasTelegram: true,
      hasWhatsApp: true
    },
    dateUpdated: 1703152689149
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 43,
    offer: {
      type: 'rent',
      price: 4000
    },
    contact: {
      phone: '+7 (928) 296-85-04'
    },
    dateUpdated: 1703241327334
  },
  {
    variant: 'standard',
    level: -1,
    building: 2,
    parkingNumber: 73,
    offer: {
      type: 'rent',
      price: 6000,
      description: 'Рядом с лифтом. Сдается на пол года. (12 этажный дом)'
    },
    contact: {
      phone: '+7 (928) 602-79-31',
      hasWhatsApp: true
    },
    dateUpdated: 1703509169012
  },
  {
    variant: 'standard',
    level: -1,
    building: 1,
    offer: {
      type: 'rent',
      price: 5500,
      description: 'Место под 5 литером. Легко заехать/выехать. Лифт близко. Сдается на длительный период.'
    },
    contact: {
      hasTelegram: true,
      hasWhatsApp: true,
      phone: '+7 (903) 486-20-40'
    },
    parkingNumber: 73,
    dateUpdated: 1704576127571
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    offer: {
      type: 'rent',
      price: 6000
    },
    contact: {
      hasTelegram: true,
      phone: '+7 (918) 585-89-61'
    },
    dateUpdated: 1704735827592
  }

] as ParkingOfferInfo[];
