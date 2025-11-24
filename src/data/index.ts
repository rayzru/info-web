import { GroupInfo } from '@/types';

export default [
  {
    id: 'uk',
    rows: 9,
    title: 'Управляющая компания',
    subtitle: 'Сердце Ростова',
    logo: 'sr2',
    addresses: [
      {
        title: 'Офис',
        city: 'г. Ростов-на-Дону',
        address: 'пр. Михаила Нагибина, 33а/47',
        floor: 3,
        office: '306',
        postcode: 344068,
        lnglat: [47.257861, 39.715947],
        maps: ['https://yandex.ru/maps/-/CDaKvE~D'],
      },
    ],
    phones: [
      {
        title: 'Диспетчерcкая УК',
        phone: '+7 (960) 448-08-18',
        hasWhatsApp: true,
      },
      // {
      //   title: 'Начальник участка',
      //   subtitle: 'Наталья Вячеславовна Волошина',
      //   phone: '+7 (960) 454-35-48',
      //   // hasWhatsApp: true,
      // },
      {
        title: 'Начальник участка',
        subtitle: 'Соболев Александр Сергеевич',
        phone: '+7 (906) 453-40-97',
        hasWhatsApp: true,
        hasTelegram: true,
      },
      {
        title: 'Мастер участка',
        subtitle: 'Алина Гамзатхановна Гаджиева',
        phone: '+7 (905) 478-77-83',
      },
      // {
      //   title: 'Мастер участка',
      //   subtitle: 'Даниил Лукашов',
      //   phone: '+7 (905) 478-76-99',
      // },
      {
        title: 'Технический директор',
        subtitle: 'Андрей Вадимович',
        phone: '+7 (905) 429-09-92',
        hasWhatsApp: true,
      },
      {
        title: 'Директор по работе с населением',
        subtitle: 'Сергей Григорьевич Сагиров',
        phone: '+7 (960) 461-44-60',
        hasWhatsApp: true,
      },
      {
        title: 'Директор',
        subtitle: 'Анжела Анатольевна Башкирова',
        phone: '+7 (960) 448-58-08',
        hasWhatsApp: true,
      },
      {
        title: 'Расчетный отдел',
        subtitle: 'Бухгалтерия',
        phone: '+7 (903) 403-09-30',
        hasWhatsApp: true,
      },
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://uk-sr.ru/',
      },
    ],
  },
  {
    id: 'sr2',
    rows: 12,
    title: 'Аварийные службы',
    subtitle: 'Сердце Ростова 2',
    logo: 'sr2',
    addresses: [
      {
        title: 'Местоположение',
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, 45',
      },
    ],
    phones: [
      {
        title: 'Аварийно-диспетчерская служба',
        phone: '+7 (960) 448-00-98',
      },
      {
        title: 'Электрик',
        subtitle: 'Андрей Сергеевич',
        phone: '+7 (961) 435-56-59',
      },
      {
        title: 'Электрик',
        subtitle: 'Тагир',
        phone: '+7 (908) 194-24-08',
      },
      {
        title: 'Сантехник',
        subtitle: 'Андрей Юрьевич',
        phone: '+7 (938) 155-22-37',
      },
      {
        title: 'Сантехник',
        subtitle: 'Михаил Евгеньевич',
        phone: '+7 (961) 402-84-63',
      },
      {
        title: 'Сантехник',
        subtitle: 'Михаил',
        phone: '+7 (952) 415-21-95',
      },
      {
        title: 'Cантехник',
        subtitle: 'Анатолий',
        phone: '+7 (908) 506-57-16',
      },
      {
        title: 'Тепловой пункт',
        subtitle: 'ИП Малов С.А.',
        phone: '+7 (989) 518-97-37',
      },
      {
        title: 'Застройщик - ООО МСК-СТРОЙ',
        subtitle: 'Прораб Стрекалов Игорь',
        phone: '+7 (928) 152-12-12',
      },
      {
        title: 'Ворота',
        subtitle: 'ООО ГостСервис',
        phone: '+7 (863) 297-56-01',
      },
      {
        title: 'Домофон',
        subtitle: 'ООО ПрофДелоДон',
        phone: '+7 (928) 296-31-49',
      },
      {
        title: 'Лифтовая диспетчерская',
        subtitle: 'ООО ЮгЛифтСервис',
        phone: '+7 (928) 296-31-49',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Общий чат',
        messengerType: 'telegram',
        link: 'http://go.sr2.today/telegram',
      },
    ],
    tags: ['complex'],
  },
  {
    id: 'zhkh',
    rows: 4,
    title: 'Службы ЖКХ',
    subtitle: 'Ресурсы и службы ЖКХ',
    logo: '',
    urls: [
      {
        title: 'Квартплата.Онлайн',
        subtitle: 'Регистрации показаний и оплата',
        url: 'https://xn--80aaaf3bi1ahsd.xn--80asehdb/',
      },
      {
        title: 'Госуслуги.Дом - Android',
        subtitle: 'Решение всех вопросов ЖКХ в одном приложении',
        url: 'https://play.google.com/store/apps/details?id=ru.sigma.gisgkh',
      },
      {
        title: 'Госуслуги.Дом - iOS',
        subtitle: 'Решение всех вопросов ЖКХ в одном приложении',
        url: 'https://apps.apple.com/ru/app/%D0%B3%D0%BE%D1%81%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8-%D0%B4%D0%BE%D0%BC/id1616550510',
      },
    ],
  },
  {
    id: 'building1',
    rows: 5,
    title: 'Строение 1',
    subtitle: 'Литеры 4, 5',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 1',
        maps: ['https://yandex.ru/maps/-/CDRsJJ3r'],
      },
    ],
    phones: [
      {
        title: 'Консьерж - подъезд 1',
        phone: '+7 (960) 461-44-24',
      },
      {
        title: 'Консьерж - подъезд 2',
        phone: '+7 (960) 461-44-25',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 1',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s1',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building2',
    rows: 5,
    title: 'Строение 2',
    subtitle: 'Литеры 2, 3',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 2',
        maps: ['https://yandex.ru/maps/-/CDRsF-Ix'],
      },
    ],
    phones: [
      {
        title: 'Консьерж - подъезд 1',
        phone: '+7 (960) 461-44-21',
      },
      {
        title: 'Консьерж - подъезд 2',
        phone: '+7 (960) 461-44-32',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 2',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s2',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building3',
    rows: 5,
    title: 'Строение 3',
    subtitle: 'Литер 9',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 3',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 3',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s3',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building4',
    rows: 5,
    title: 'Строение 4',
    subtitle: 'Литер 1',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 4',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 4',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s4',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building5',
    rows: 5,
    title: 'Строение 5',
    subtitle: 'Литер 8',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 5',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 5',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s5',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building6',
    rows: 5,
    title: 'Строение 6',
    subtitle: 'Литер 7',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 6',
        maps: ['https://yandex.ru/maps/-/CDawbKob'],
      },
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
        title: 'Telegram - Строение 6',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s6',
      },
    ],
    tags: ['complex', 'building'],
  },
  {
    id: 'building7',
    rows: 5,
    title: 'Строение 7',
    subtitle: 'Литер 6',
    logo: 'root',
    addresses: [
      {
        city: 'г. Ростов-на-Дону',
        address: 'ул. Ларина, д.45, строение 7',
        maps: ['https://yandex.ru/maps/-/CDawbKIU'],
      },
    ],
    phones: [
      {
        title: 'Консьерж - подъезд 1',
        phone: '+7 (905) 478-78-21',
      },
      {
        title: 'Консьерж - подъезд 2',
        phone: '+7 (905) 478-78-27',
      },
    ],
    messengers: [
      {
        title: 'Telegram - Строение 7',
        messengerType: 'telegram',
        link: 'https://t.me/sr2_s7',
      },
    ],
    tags: ['complex', 'building'],
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
        maps: ['https://yandex.ru/maps/-/CTqyZjq'],
      },
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://msk-development.ru/projects/flats/serdce-rostova2',
      },
      {
        title: 'Заявка на гарантийные работы',
        url: 'https://forms.gle/umA7WHfsSs1HD6CV6',
      },
    ],
    messengers: [
      {
        link: 'https://wa.me/+79188500955',
        messengerType: 'whatsapp',
        title: 'Официальный WhatsApp чат',
      },
      {
        link: 'https://t.me/msk_development',
        messengerType: 'telegram',
        title: 'Официальный Telegram чат',
      },
    ],
    texts: [
      {
        title: 'Реквизиты',
        text: `Общество с ограниченной отвественностью "МСК-СТРОЙ" (ООО "МСК-СТРОЙ")
344011, Ростовская область, город Ростов-на-Дону, Доломановский пер., д. 70д этаж 5, ком. 11
ИНН: 7729482490, КПП: 616401001
ОГРН: 5157746058620
р/с: 40702810552090020807
в Юго-Западном банке ПАО «Сбербанк» г. Ростов-на-Дону
к/с 30101810600000000602
БИК 046015602
`,
      },
    ],
  },
  {
    id: 'domofon',
    rows: 5,
    logo: 'vdome',
    title: 'Домофоны',
    subtitle: 'VDome',
    phones: [
      {
        title: 'Диспетчерская',
        phone: '+7 (863) 310-02-26',
      },
    ],
    messengers: [
      {
        title: 'WhatsApp робот',
        subtitle: 'Регистрация, инструкция',
        messengerType: 'whatsapp',
        link: 'https://wa.me/+79963530117?text=инструкция',
      },
    ],
    urls: [
      {
        title: 'Приложение для Android',
        url: 'https://play.google.com/store/apps/details?id=ru.mts.vdome.resident',
      },
      {
        title: 'Приложение для iOS',
        url: 'https://apps.apple.com/ru/app/vdome/id1491163759',
      },
    ],
  },
  {
    id: 'vodokanal',
    rows: 3,
    title: 'Водоканал',
    logo: 'vodokanal',
    phones: [
      {
        title: 'Передача показаний счетчиков',
        phone: '+7 (863) 309-09-09',
      },
    ],
    urls: [
      {
        title: 'Личный кабинет',
        url: 'https://lkfl.vodokanalrnd.ru/',
      },
    ],
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
        url: 'https://lk.rostov.tns-e.ru/',
      },
    ],
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
        maps: ['https://yandex.ru/maps/-/CDeQI65C'],
      },
    ],
    phones: [
      {
        title: 'Горячая линия',
        phone: '8-800-707-05-08',
      },
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'hhttps://rostov.clean-rf.ru/',
      },
    ],
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
        phone: '+7 (928) 110-06-86',
      },
    ],
    urls: [
      {
        title: 'Официальный сайт',
        url: 'https://ts-ug.ru/',
      },
    ],
    messengers: [
      {
        title: 'WhatsApp, подать показания',
        link: 'https://wa.me/+79381009510',
        messengerType: 'whatsapp',
      },
    ],
  },
  {
    id: 'domru',
    rows: 4,
    title: 'дом.ру',
    subtitle: 'Интернет-провайдер',
    logo: 'domru',
    phones: [
      {
        title: 'Техническая поддержка',
        phone: '+7 (863) 307-50-01',
        tags: 'phone',
      },
    ],
    urls: [
      {
        url: 'https://dealers.dom.ru/request/widget?domain=rostov&referral_id=1000181217',
        title: 'Подключение (строения 1, 2)',
        subtitle: 'В домах введено оборудование',
      },
      {
        url: 'https://forms.gle/FHVGqTtvkTWVWNfJ6',
        title: 'Предварительная заявка (строения 3-9)',
        subtitle: 'Дома планируется подключить',
      },
      {
        url: 'https://rostov.dom.ru/',
        title: 'Официальный сайт',
      },
    ],
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
        title: 'Заявка на подключение онлайн',
      },
      {
        url: 'https://rostov-na-donu.beeline.ru/customers/products/home/internet/',
        title: 'Официальный сайт',
      },
    ],
  },
  {
    id: 'orbita',
    rows: 3,
    title: 'Орбита',
    subtitle: 'Интернет-провайдер',
    logo: '',
    phones: [
      {
        title: 'Техническая поддержка',
        phone: '+7 (863) 318-0-318',
      },
    ],
    urls: [
      {
        url: 'https://orbitanov.ru/rostov/',
        title: 'Тарифы, подключение',
      },
    ],
  },
  {
    id: 'medical',
    rows: 9,
    title: 'Поликлиника № 5',
    subtitle: '',
    addresses: [
      {
        address: 'Оренбургский переулок, 22/1',
        maps: ['https://yandex.ru/maps/-/CDq4YBzO'],
      },
    ],
    phones: [
      {
        title: 'Неотложная помощь',
        phone: '+7 (961) 277‒66‒07',
      },
      {
        title: 'Колл-центр',
        phone: '+7 (938) 181-76-06',
      },
      {
        title: 'Регистратура',
        subtitle: 'Взрослая поликлиника',
        phone: '+7 (863) 243‒64‒11',
      },
      {
        title: 'Терапевтическое отделение №2',
        phone: '+7 (863) 243-65-77',
      },
      {
        title: 'Женская консультация',
        phone: '+7 (928) 212-09-52',
      },
      {
        title: 'Регистратура',
        subtitle: 'Детская поликлиника',
        phone: '+7 (863) 243‒68‒66',
      },
      {
        title: 'Педиатрическое отделение №2',
        phone: '+7 (906) 429-28-33',
      },
    ],
    urls: [
      {
        url: 'https://www.policlinic5.ru',
        title: 'Официальный сайт',
      },
    ],
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
        phone: '+7 (999) 471-07-53',
      },
      {
        title: 'Дежурная часть ГАИ',
        subtitle: '',
        phone: '+7 (863) 277-77-07',
      },
      {
        title: 'Диспетчер ГАИ',
        subtitle: '',
        phone: '+7 (863) 249-42-77',
      },
    ],
  },
] as GroupInfo[];
