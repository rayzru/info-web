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
    level: -2,
    building: 1,
    parkingNumber: 45,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Место широкое, под 5 литером на длительный период'
    },
    contact: {
      phone: '+7 (928) 226-55-56',
      hasTelegram: true,
      hasWhatsApp: true
    },
    dateUpdated: 1701201784319
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
    building: 7,
    parkingNumber: 43,
    contact: {
      hasTelegram: true,
      hasWhatsApp: true,
      phone: '+7 (928) 296-85-04'
    },
    offer: {
      description: 'Размер 15 м',
      type: 'rent',
      price: 4300
    },
    dateUpdated: 1702101861957
  }


  // {
  //   variant: 'standard',
  //   level: -1,
  //   building: 6,
  //   parkingNumber: 67,
  //   offer: {
  //     type: 'sell',
  //     price: 1000000
  //   },
  //   contact: {
  //     phone: '+7 (891) 851-38-41',
  //     hasWhatsApp: true,
  //     hasTelegram: true
  //   },
  //   dateUpdated: 1701257390227
  // }

] as ParkingOfferInfo[];
