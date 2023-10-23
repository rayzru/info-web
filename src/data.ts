import { GroupInfo } from '@/types';

export default [
  {
    id: 'root',
    title: 'Сердце Ростова 2',
    subtitle: 'Жилой комплекс',
    logo: 'sr2',
    addresses: [
      {
        title: 'Местоположение',
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, 45'
      }
    ],
    messengers: [
      {
        title: 'WhatsApp',
        mesengerType: 'whatsapp',
        link: 'http://go.sr2.today/whatsapp'
      },
      {
        title: 'Telegram - Общий чат',
        mesengerType: 'telegram',
        link: 'http://go.sr2.today/telegram'
      }
    ]
  },
  {
    id: 'uk',
    title: 'Сердце Ростова',
    subtitle: 'Управляющая компания',
    logo: 'sr2',
    addresses: [
      {
        title: 'Головной офис',
        city: 'г. Ростов-на-Дону',
        address: 'пр. Михаила Нагибина, 33а/47',
        floor: 3,
        office: '306',
        postcode: 344068,
        lnglat: [47.257861, 39.715947],
        maps: ['https://yandex.ru/maps/-/CDaKvE~D']
      }
    ],
    phones: [
      {
        title: 'Контактный телефон',
        phone: '+7 (960) 448-08-18'
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://uk-sr.ru/'
      }
    ],
    messengers: [
      {
        title: 'Чат WhatsApp',
        mesengerType: 'whatsapp',
        link: 'https://wa.me/+79604480818'
      }
    ]
  }
] as GroupInfo[];