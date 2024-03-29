import { ParkingOfferInfo } from '@/types';

const parkingData: ParkingOfferInfo[] = [
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
      price: 950000,
    },
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
      description: 'Аренда на 6 месяцев',
    },
  },
  {
    variant: 'standard',
    building: 6,
    parkingNumber: 148,
    offer: {
      type: 'rent',
      price: 3000,
    },
    contact: {
      phone: '+7 (905) 450-39-06',
      hasTelegram: true,
      hasWhatsApp: true,
    },
    level: -1,
    dateUpdated: 1701019163091,
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 31,
    offer: {
      type: 'rent',
      price: 5000,
    },
    contact: {
      hasTelegram: true,
      phone: '+7 (989) 502-60-97',
    },
    dateUpdated: 1701175341351,
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 42,
    offer: {
      type: 'rent',
      price: 6000,
      description: 'Удобное место рядом с лифтом',
    },
    contact: {
      phone: '+7 (989) 637-97-19',
      hasTelegram: true,
      hasWhatsApp: true,
    },
    dateUpdated: 1701252401509,
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 61,
    offer: {
      type: 'rent',
      price: 4000,
    },
    contact: {
      phone: '+7 (900) 136-21-11',
    },
    dateUpdated: 1701879650097,
  },
  {
    variant: 'standard',
    level: -1,
    offer: {
      type: 'rent',
      price: 4000,
      description: 'Рядом с лифтом',
    },
    contact: {
      phone: '+7 (926) 611-42-28',
      hasTelegram: true,
      hasWhatsApp: true,
    },
    building: 6,
    parkingNumber: 168,
    dateUpdated: 1702397342913,
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
      hasWhatsApp: true,
    },
    dateUpdated: 1703152689149,
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 43,
    offer: {
      type: 'rent',
      price: 4000,
    },
    contact: {
      phone: '+7 (928) 296-85-04',
    },
    dateUpdated: 1703241327334,
  },
  {
    variant: 'standard',
    level: -1,
    building: 1,
    offer: {
      type: 'rent',
      price: 5500,
      description:
        'Место под 5 литером. Легко заехать/выехать. Лифт близко. Сдается на длительный период.',
    },
    contact: {
      hasTelegram: true,
      hasWhatsApp: true,
      phone: '+7 (903) 486-20-40',
    },
    parkingNumber: 73,
    dateUpdated: 1704576127571,
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 44,
    offer: {
      type: 'sell',
      price: 1250000,
      description:
        'Продажа только вместе с 45 местом (за два места 2.500.000₽)',
    },
    contact: {
      phone: '+7 (903) 405-29-95',
    },
    dateUpdated: 1705330814473,
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 45,
    offer: {
      type: 'sell',
      price: 1250000,
      description:
        'Продажа только вместе с 44 местом (за два места 2.500.000₽)',
    },
    contact: {
      phone: '+7 (903) 405-29-95',
    },
    dateUpdated: 1705330861122,
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 53,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Удобный заезд',
    },
    contact: {
      phone: '+7 (928) 751-77-14',
      hasWhatsApp: true,
      hasTelegram: true,
    },
    dateUpdated: 1705578096351,
  },
  {
    variant: 'standard',
    building: 6,
    parkingNumber: 41,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Размер стандартный, без колонн. Недалеко от въезда.'
    },
    contact: {
      phone: '+7 (905) 486-11-16',
      hasTelegram: true
    },
    level: -1,
    dateUpdated: 1707317690878
  },
  {
    variant: 'standard',
    building: 2,
    level: -2,
    parkingNumber: 40,
    offer: {
      type: 'rent',
      price: 5000
    },
    contact: {
      phone: '+7 (919) 883-86-30',
      hasTelegram: true,
      hasWhatsApp: true
    },
    dateUpdated: 1707408739088
  },
  {
    variant: 'standard',
    building: 7,
    parkingNumber: 120,
    offer: {
      type: 'rent',
      price: 4000,
    },
    contact: {
      phone: '+7 (919) 899-93-11',
      hasTelegram: true,
      hasWhatsApp: true
    },
    level: -1,
    dateUpdated: 1707587232747
  },
  {
    variant: 'standard',
    building: 7,
    level: -1,
    parkingNumber: 44,
    offer: {
      type: 'rent',
      price: 6000
    },
    contact: {
      phone: '+7 (903) 405-29-95',
      hasWhatsApp: true
    },
    dateUpdated: 1707762123469
  },
  {
    variant: 'standard',
    building: 7,
    level: -1,
    parkingNumber: 45,
    offer: {
      type: 'rent',
      price: 6000
    },
    contact: {
      phone: '+7 (903) 405-29-95',
      hasWhatsApp: true
    },
    dateUpdated: 1707762156871
  },
  {
    variant: 'standard',
    building: 1,
    parkingNumber: 70,
    level: -1,
    contact: {
      phone: '+7 (919) 878-18-48',
      hasWhatsApp: true
    },
    offer: {
      type: 'sell',
      price: 990000,
      description: 'Труб сверху нет, не на проезде, удачное сухое место!'
    },
    dateUpdated: 1707981480108
  },
  {
    variant: 'standard',
    level: -1,
    building: 7,
    parkingNumber: 68,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Под первым подъездом рядом с лифтом.'
    },
    contact: {
      phone: '+7 (928) 125-44-75',
      hasWhatsApp: true,
      hasTelegram: true
    },
    dateUpdated: 1708108846183
  },
  {
    variant: 'standard',
    building: 7,
    level: -1,
    parkingNumber: 9,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Удачное расположение рядом с выездом и с лифтами'
    },
    contact: {
      phone: '+7 (961) 316-93-13',
      hasWhatsApp: true,
      hasTelegram: true
    },
    dateUpdated: 1708680836828
  },
  {
    variant: 'standard',
    building: 7,
    level: -1,
    parkingNumber: 10,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Удачное расположение рядом с выездом и с лифтами'
    },
    contact: {
      phone: '+7 (961) 316-93-13',
      hasWhatsApp: true,
      hasTelegram: true
    },
    dateUpdated: 1708680836828
  },
  {
    variant: 'standard',
    building: 6,
    level: -1,
    parkingNumber: 38,
    offer: {
      type: 'rent',
      price: 5000,
      description: 'Хорошее место',
    },
    contact: {
      phone: '+7 (911) 884-10-85',
      hasWhatsApp: true,
      hasTelegram: true
    },
    dateUpdated: 1709228229108
  },
  {
    variant: 'standard',
    building: 6,
    level: -1,
    parkingNumber: 121,
    offer: {
      type: 'rent',
      price: 4000
    },
    contact: {
      phone: '+7 (919) 899-93-11',
      hasWhatsApp: true,
      hasTelegram: true
    },
    dateUpdated: 1709645840577
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 186,
    offer: {
      type: 'rent',
      description: '1 подъезд. Удачное место рядом с лифтом, удобно парковаться. Залог за ключ и пульт 1500р. Рассмотриваем аренду на сроки от 10 дней при условии залога за пульт.',
      price: 5000
    },
    contact: {
      phone: '+7 (908) 197-47-67'
    },
    dateUpdated: 1711599189646
  }, {
    variant: 'standard',
    building: 7,
    level: -1,
    parkingNumber: 37,
    offer: {
      type: 'rent',
      price: 5500,
      description: 'Между двух подъездов, большая площадь, на полгода'
    },
    contact: {
      phone: '+7 (918) 850-50-14'
    },
    dateUpdated: 1709805010287
  }, {
    variant: 'standard',
    building: 1,
    level: -2,
    parkingNumber: 9,
    offer: {
      type: 'sell',
      price: 750000,
    },
    contact: {
      phone: '+7 (906) 428-84-25',
      hasWhatsApp: true
    },
    dateUpdated: 1710160650783
  },
  {
    variant: 'standard',
    building: 2,
    level: -1,
    parkingNumber: 1,
    offer: {
      type: 'rent',
      price: 6000,
      description: 'Удобное угловое место возле лифта. Широкий заезд без колонн. Залог за пульт 2000р'
    },
    contact: {
      phone: '+7 (909) 403-03-03',
      hasTelegram: true,
      hasWhatsApp: true
    },
    dateUpdated: 1710399128576
  },
  {
    variant: 'standard',
    level: -1,
    contact: {
      phone: '+7 (928) 954-09-28'
    },
    offer: {
      type: 'rent',
      price: 5500
    },
    parkingNumber: 5,
    building: 1,
    dateUpdated: 1711225965644
  },
  {
    variant: 'standard',
    level: -1,
    building: 6,
    parkingNumber: 17,
    offer: {
      type: 'rent',
      price: 4000
    },
    contact: {
      phone: '+7 (906) 422-07-66',
      hasWhatsApp: true
    },
    dateUpdated: 1711712402272
  }

];

export default parkingData;
