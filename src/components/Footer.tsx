'use client';

import { MouseEvent, useState } from 'react';
import { clsx } from 'clsx';

import { ThanxModal } from './ThanxModal';

import styles from './Footer.module.scss';

export const Footer = () => {
  const [open10x, setOpen10x] = useState(false);

  function handleOpen10x(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setOpen10x(true);
  }
  return (
    <footer className={ styles.footer }>

      {/* <section className={ styles.linksSection }>
      <Link target='_blank' className={ styles.link } href={ 'https://sr2.today' }>Сайт Сообщества</Link>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/vk' }>Вконтакте</Link>
    </section>

    <section className={ styles.linksSection }>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/telegram' }>Чат Telegram</Link>
      <Link target='_blank' className={ styles.link } href={ 'https://go.sr2.today/whatsapp' }>Чат WhatsApp</Link>
    </section> */}

      <section className={ styles.wide }>
        Проект разработан для сообщества соседей, собственников ЖК&nbsp;&laquo;Сердце&nbsp;Ростова&nbsp;2&raquo;.<br />
        Информация взята из открытых источников
      </section>

      <section className={ styles.wide } style={ { display: 'block' } }>
        Не хватает информации или нашли ошибку - пишите&nbsp;в&nbsp;<a target='_blank' className={ styles.link } href='https://t.me/rayzru' >Telegram</a>
        <br />
        <a target='_blank' className={ clsx(styles.link, styles.donate) } href={ 'https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/' }>
        Поддержать проект материально
        </a> или <a className={ clsx(styles.link, styles.donate) } onClick={ handleOpen10x } href="#">сказать спасибо</a>
      </section>
      <ThanxModal closeHandler={ () => setOpen10x(false) } open={ open10x } />
    </footer>
  );
};
