import { CardColor, GroupInfo } from '@/types';

export default [
  {
    id: 'uk',
    rows: 7,
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
      },
      {
        title: 'Квартплата.Онлайн',
        url: 'https://xn--80aaaf3bi1ahsd.xn--80asehdb/'
      },

    ],
    messengers: [
    ]
  },
  {
    id: 'root',
    rows: 6,
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
    id: 'liter1',
    rows: 2,
    title: 'Литер 1',
    // color: CardColor.red,
    logo: 'root',
    messengers: [
      {
        title: 'Telegram - Литер 1',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2l1'
      }
    ]
  },
  {
    id: 'liter2',
    rows: 3,
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
    rows: 3,
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
  },
  {
    id: 'liter4',
    rows: 3,
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
    rows: 3,
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
    rows: 3,
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
    rows: 3,
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
      },
      {
        title: 'Консьерж - подъезд 2',
        phone: '+7 (906) 425-94-39',
      },
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
    id: 'liter8',
    rows: 2,
    title: 'Литер 8',
    // color: CardColor.red,
    logo: 'root',
    messengers: [
      {
        title: 'Telegram - Литер 8',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2l8'
      }
    ]
  },
  {
    id: 'liter9',
    rows: 2,
    title: 'Литер 9',
    // color: CardColor.red,
    logo: 'root',
    messengers: [
      {
        title: 'Telegram - Литер 9',
        mesengerType: 'telegram',
        link: 'https://t.me/sr2_l9'
      }
    ]
  },
  {
    id: 'domofon',
    rows: 4,
    logo: 'vdome',
    title: 'Домофон',
    phones: [{
      title: 'Обслуживание',
      phone: '+7 (863) 310-02-26'
    }, {
      phone: '+7 (928) 226-96-42'
    }],
    messengers: [{
      title: 'WhatsApp робот',
      subtitle: 'Регистрация, инструкция',
      mesengerType: 'whatsapp',
      link: 'https://wa.me/+79963530117?text=инструкция'
    }],
    urls: [
      {
        title: 'Приложение для Android',
        url: 'https://play.google.com/store/apps/details?id=ru.mts.vdome.resident'
      },
      {
        title: 'Приложение для iOS',
        url: 'https://apps.apple.com/ru/app/vdome/id1491163759'
      },
    ]
  },
  {
    id: 'vodokanal',
    rows: 3,
    title: 'Водоканал',
    subtitle: '',
    logo: 'vodokanal',
    phones: [
      {
        title: 'Передача показаний счетчиков',
        phone: '+7 (863) 309-09-09'
      }
    ],
    urls: [
      {
        title: 'Личный кабинет',
        url: 'https://lkfl.vodokanalrnd.ru/'
      }
    ]
  },
  {
    id: 'tns',
    rows: 3,
    title: 'ТНС-Энерго',
    subtitle: '',
    logo: 'tns',
    urls: [
      {
        title: 'Личный кабинет',
        url: 'https://lk.rostov.tns-e.ru/'
      },
    ]
  },
  {
    id: 'rnd',
    rows: 3,
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
  }
] as GroupInfo[];
