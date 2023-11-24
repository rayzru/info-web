import { CardColor, GroupInfo } from '@/types';

export default [

  {
    id: 'sr2',
    rows: 6,
    title: 'Жилой комплекс',
    color: CardColor.complex,
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
        title: 'Электрик',
        subtitle: 'Павел Джумак',
        phone: '+7 (999) 692-63-77',
        visible: false,
      },
      {
        title: 'Сантехник',
        subtitle: 'Михаил',
        phone: '+7 (961) 402-84-63',
      },
      {
        title: 'Cантехник',
        subtitle: 'Павел Косухин',
        phone: '+7 (999) 697-46-09',
        visible: false,
      },
      {
        title: 'Cантехник',
        subtitle: 'Вячеслав Хавренко',
        phone: '+7 (918) 598-98-02',
        visible: false,
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
        messengerType: 'whatsapp',
        link: 'http://go.sr2.today/whatsapp'
      },
      {
        title: 'Telegram - Общий чат',
        messengerType: 'telegram',
        link: 'http://go.sr2.today/telegram'
      }
    ],
    tags: ['complex']
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2l1'
      }
    ],
    tags: ['complex', 'building']
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
        address: 'ул. Ларина, 45, стр. 2, подъезд 1',
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l2'
      }
    ],
    tags: ['complex', 'building']
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
        address: 'ул. Ларина, 45, стр. 2, подъезд 2',
        maps: ['https://yandex.ru/maps/-/CDawbV4v']
      }
    ],
    phones: [
      {
        title: 'Консьерж',
        subtitle: 'подъезд 2',
        phone: '+7 (960) 461-44-32',
      }
    ],
    messengers: [
      {
        title: 'Telegram - Литер 3',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l3'
      }
    ],
    tags: ['complex', 'building']
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l4'
      }
    ],
    tags: ['complex', 'building']
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l5'
      }
    ],
    tags: ['complex', 'building']
  },
  {
    id: 'liter6',
    rows: 5,
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
    phones: [
      {
        title: 'Консьерж - подъезд 1',
        phone: '+7 (905) 478-78-21',
      },
      {
        title: 'Консьерж - подъезд 2',
        phone: '+7 (905) 478-78-24',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Литер 6',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l6'
      }
    ],
    tags: ['complex', 'building']
  },
  {
    id: 'liter7',
    rows: 4,
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l7'
      }
    ],
    tags: ['complex', 'building']
  },
  {
    id: 'liter8',
    rows: 2,
    title: 'Литер 8',
    logo: 'root',
    messengers: [
      {
        title: 'Telegram - Литер 8',
        messengerType: 'telegram',
        link: 'https://t.me/sr2l8'
      }
    ],
    tags: ['complex', 'building']
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
        messengerType: 'telegram',
        link: 'https://t.me/sr2_l9'
      }
    ],
    tags: ['complex', 'building']
  },
  {
    id: 'uk',
    rows: 9,
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
        maps: ['https://yandex.ru/maps/-/CDaKvE~D'],
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
        title: 'Мастер участка',
        subtitle: 'Даниил Лукашов',
        phone: '+7 (905) 478-76-99',
        hasWhatsApp: true,
        visible: false,
      },
      {
        title: 'Главный инженер',
        subtitle: 'Денис Михайлович Талашов',
        phone: '+7 (960) 448-38-28',
        hasWhatsApp: true,
      },
      {
        title: 'Заместитель директора',
        subtitle: 'Анжела Анатольевна Башкирова',
        phone: '+7 (960) 448-58-08',
        hasWhatsApp: true,
      },
      {
        title: 'Бухгалтерия',
        phone: '+7 (960) 448-78-18',
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
  },
  {
    id: 'msk',
    rows: 6,
    title: 'Застройщик',
    subtitle: 'Московская строительная компания',
    logo: 'msk',
    phones: [
      {
        title: 'Горячая линия',
        phone: '+7 800 777-75-77',
      },
      {
        title: 'Гарантийный отдел',
        subtitle: 'Елена Юкина',
        phone: '+7 (938) 175-44-81',
        hasWhatsApp: true,
      },
      {
        title: 'Дежурный прораб',
        subtitle: 'Игорь Стрекалов',
        phone: '+7 (928) 152-12-12',
        hasWhatsApp: true,
      },

    ],
    addresses: [
      {
        address: 'пер. Доломановский, 70д',
        floor: 5,
        city: 'г. Ростов-на-Дону',
        maps: ['https://yandex.ru/maps/-/CTqyZjq']
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://msk-development.ru/projects/flats/serdce-rostova2'
      },
      {
        title: 'Заявка на гарантийные работы',
        url: 'https://forms.gle/umA7WHfsSs1HD6CV6'
      },
    ],
    messengers: [
      {
        link: 'https://wa.me/+79188500955',
        messengerType: 'whatsapp',
        title: 'Официальный WhatsApp чат'
      },
      {
        link: 'https://t.me/msk_development',
        messengerType: 'telegram',
        title: 'Официальный Telegram чат'
      },
    ],
    texts: [{
      title: 'Реквизиты',
      text: `Общество с ограниченной отвественностью "МСК-СТРОЙ" (ООО "МСК-СТРОЙ")
344011, Ростовская область, город Ростов-на-Дону, Доломановский пер., д. 70д этаж 5, ком. 11
ИНН: 7729482490, КПП: 616401001
ОГРН: 5157746058620
р/с: 40702810552090020807
в Юго-Западном банке ПАО «Сбербанк» г. Ростов-на-Дону
к/с 30101810600000000602
БИК 046015602
`
    }]
  },
  {
    id: 'domofon',
    rows: 5,
    logo: 'vdome',
    title: 'Домофоны',
    subtitle: 'VDome',
    phones: [{
      title: 'Диспетчерская',
      phone: '+7 (863) 310-02-26'
    }, {
      title: 'Мастер',
      subtitle: 'Алексей',
      phone: '+7 (999) 481-38-68'
    }],
    messengers: [{
      title: 'WhatsApp робот',
      subtitle: 'Регистрация, инструкция',
      messengerType: 'whatsapp',
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
    rows: 2,
    title: 'ТНС-Энерго',
    subtitle: 'Электричество',
    logo: 'tns',
    urls: [
      {
        title: 'Личный кабинет',
        url: 'https://lk.rostov.tns-e.ru/'
      },
    ]
  },
  {
    id: 'cleancity',
    rows: 4,
    title: 'Чистый город',
    subtitle: 'ТКО',
    logo: 'recycle',
    addresses: [
      {
        title: 'Офис',
        address: 'просп. Михаила Нагибина, д.27',
        maps: ['https://yandex.ru/maps/-/CDeQI65C']
      }
    ],
    phones: [
      {
        title: 'Горячая линия',
        phone: '8-800-707-05-08'
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'hhttps://rostov.clean-rf.ru/'
      },
    ]
  },
  {
    id: 'ts-ug',
    rows: 4,
    title: 'ТеплоСервис Юг',
    subtitle: 'Отопление и горячая вода',
    logo: 'ts-ug',
    phones: [
      {
        title: 'Аварийная служба',
        phone: '+7 (928) 110-06-86'
      }
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://ts-ug.ru/'
      },
    ],
    messengers: [
      {
        title: 'WhatsApp, подать показания',
        link: 'https://wa.me/+79381009510',
        messengerType: 'whatsapp'
      },
    ]
  },
  {
    id: 'domru',
    rows: 4,
    title: 'дом.ру',
    subtitle: 'Интернет-провайдер',
    logo: 'domru',
    phones: [
      {
        title: 'Горячяя линия',
        phone: '+7 (863) 307-50-01',
        tags: 'phone'
      },
    ],
    urls: [
      {
        url: 'https://forms.gle/FHVGqTtvkTWVWNfJ6',
        title: 'Предварительная заявка (строения 1, 3-9)',
        subtitle: 'Дома планируется подключить'
      },
      {
        url: 'https://dealers.dom.ru/request/widget?domain=rostov&referral_id=1000181217',
        title: 'Подключение (строение 2)',
        subtitle: 'В домах введено оборудование'
      },
      {
        url: 'https://rostov.dom.ru/',
        title: 'Официальный сайт',
      },
    ]
  },
  {
    id: 'beeline',
    rows: 4,
    title: 'билайн',
    subtitle: 'Интернет-провайдер',
    logo: 'beeline',
    phones: [
      {
        title: 'Горячяя линия',
        phone: '8 (800) 700 8000',
      },
    ],
    urls: [
      {
        url: 'https://forms.gle/oQhTbvd7WKMaKVub6',
        title: 'Заявка на подключение онлайн'
      },
      {
        url: 'https://rostov-na-donu.beeline.ru/customers/products/home/internet/',
        title: 'Официальный сайт'
      }
    ]
  },
  {
    id: 'timer',
    rows: 3,
    title: 'Таймер',
    subtitle: 'Интернет-провайдер',
    logo: 'taimer',
    phones: [
      {
        title: 'Техническая поддержка',
        phone: '+7 (863) 318-00-00',
      },
      {
        title: 'Клиентская служба',
        phone: '+7 (928) 226-92-02',
      }
    ],
    urls: [
      {
        url: 'https://timernet.ru/?city=rostov-na-donu-rostovskaya-oblast&region=11#tgroup_16_2',
        title: 'Тарифы, подключение'
      }
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
