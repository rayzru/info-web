import { CardColor, GroupInfo } from '@/types';

export default [
  {
    id: 'root',
    rows: 2,
    title: 'Жилой комплекс',
    color: CardColor.white,
    subtitle: 'Сердце Ростова 2',
    logo: 'sr2',
    addresses: [
      {
        title: 'Местоположение',
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, 45'
      }
    ],
    phones: [
      {
        title: 'Аварийно-диспетчерская служба',
        phone: '+7 (960) 448-00-98',
      },
      {
        title: 'Дежурный сантехник',
        subtitle: 'Михаил',
        phone: '+7 (961) 402-84-63',
      },
      {
        title: 'Лифтовая диспетчерская',
        subtitle: 'ООО ЮгЛифтСервис',
        phone: '+7 (928) 296-31-49',
      },
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
    id: 'liter2',
    title: 'Литер 2',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 2, подъезд 1',
        maps: ['https://yandex.ru/maps/-/CDawbV4v']
      }
    ],
    phones: [
      {
        title: 'Консьерж',
        phone: '+7 (960) 461-44-21',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 2',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l2'
      }
    ]
  },
  {
    id: 'liter3',
    title: 'Литер 3',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 2, подъезд 2',
        maps: ['https://yandex.ru/maps/-/CDawbV4v']
      }
    ],
    phones: [
      {
        title: 'Консьерж',
        phone: '+7 (960) 461-44-32',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 3',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l3'
      }
    ]
  }, {
    id: 'liter4',
    title: 'Литер 4',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 1, подъезд 1',
        maps: ['https://yandex.ru/maps/-/CDawbZ8~']
      }
    ],
    phones: [
      {
        title: 'Консьерж',
        phone: '+7 (960) 461-44-24',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 4',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l4'
      }
    ]
  },
  {
    id: 'liter5',
    title: 'Литер 5',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 1, подъезд 2',
        maps: ['https://yandex.ru/maps/-/CDawbZ8~']
      }
    ],
    phones: [
      {
        title: 'Консьерж',
        phone: '+7 (960) 461-44-25',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 5',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l5'
      }
    ]
  },
  {
    id: 'liter6',
    title: 'Литер 6',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 7',
        maps: ['https://yandex.ru/maps/-/CDawbKIU']
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 6',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l6'
      }
    ]
  },
  {
    id: 'liter7',
    title: 'Литер 7',
    // color: CardColor.red,
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 6',
        maps: ['https://yandex.ru/maps/-/CDawbKob']
      }
    ],
    phones: [
      {
        title: 'Консьерж - подъезд 1',
        phone: '+7 (906) 425-93-86',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 7',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l7'
      }
    ]
  },
  {
    id: 'uk',
    rows: 2,
    title: 'Управляющая компания',
    subtitle: 'Сердце Ростова',
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
        title: 'Диспетчер УК',
        phone: '+7 (960) 448-08-18',
        hasWhatsApp: true,
        hasTe: true,
      },
      {
        title: 'Начальник участка',
        subtitle: 'Сергей Георгиевич Сагиров',
        phone: '+7 (960) 461-44-60',
        hasWhatsApp: true,
      },
      {
        title: 'Главный инженер',
        subtitle: 'Денис Михайлович Талашов',
        phone: '+7 (960) 448-38-28',
        hasWhatsApp: true,
      },
      {
        title: 'Заместитель директора',
        subtitle: 'Анжела Анатольевна',
        phone: '+7 (960) 448-58-08',
        hasWhatsApp: true,
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://uk-sr.ru/'
      }
    ],
    messengers: [
    ]
  },
  {
    id: 'rnd',
    title: 'Ростов-на-Дону',
    subtitle: '',
    logo: 'rnd',
    phones: [
      {
        title: 'Участковый',
        subtitle: 'Возняк Александр Сергеевич',
        phone: '+7 (999) 471-07-53'
      },
      {
        title: 'Дежурная часть ГИБДД',
        subtitle: '',
        phone: '+7 (863) 277-77-07'
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://uk-sr.ru/'
      }
    ],

  }
] as GroupInfo[];