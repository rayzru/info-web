import { SetMealOutlined, SportsBarOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { clsx } from 'clsx';
import Link from 'next/link';

import styles from './Footer.module.scss';

export const Footer = () => (
  <footer className={ styles.footer }>


    <section className={ styles.linksSection }>
      <Link target='_blank' className={ styles.link } href={ 'https://sr2.today' }>Сайт Сообщества</Link>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/vk' }>Вконтакте</Link>
    </section>

    <section className={ styles.linksSection }>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/telegram' }>Чат Telegram</Link>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/whatsapp' }>Чат WhatsApp</Link>
    </section>

    <section className={ styles.wide }>
      Проект разработан для сообщества соседей, собственников ЖК&nbsp;&laquo;Сердце&nbsp;Ростова&nbsp;2&raquo;.
      <br />
      Информация взята из открытых источников
    </section>

    <section className={ styles.wide } style={ { display: 'block' } }>
      Не хватает информации или нашли ошибку - пишите&nbsp;в&nbsp;<a target='_blank' className={ styles.link } href='https://t.me/rayzru' >Telegram</a>
    </section>

    <section>
      <Link
        className={ clsx(styles.link, styles.donate) }
        target='_blank'
        href={ 'https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/' }>
        <Tooltip title={ 'Поддержать проект - на пиво и рыбку' }>
          <span>
            <SportsBarOutlined fontSize='inherit' />
            <SetMealOutlined fontSize='inherit' />
          </span>
        </Tooltip>
      </Link>
    </section>
  </footer>);
