'use client';

import { ChangeEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

import useLocalStorage from '@/hooks/use-local-storage';
import { AddressInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles, WebsiteInfo } from '@/types';

import { Address } from './Address';
import { Logo } from './Logo';
import { Messenger } from './Messenger';
import { Phone } from './Phone';
import { Subgroup } from './Subgroup';
import { WebLink } from './WebLink';

import styles from './Card.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles {
  info: GroupInfo;
}

export const Card = ({ className, info, }: Props) => {
  const { id, title, subtitle, logo, addresses, phones, messengers, color, urls, rows = 1 } = info;
  const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(isOpenedInitially);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = () => {
    updateSettings(!isOpened);
    setOpened(prev => !prev);
  };

  return (
    <article
      className={ clsx(styles.card, className, isOpened && styles[`span${rows}`]) }
      style={ { backgroundColor: color } }
    >
      <header className={ styles.header } onClick={ handleChange }>
        { logo && (
          <Logo
            className={ styles.logo }
            alt={ title }
            type={ logo }
          />
        ) }
        <div className={ styles.titles }>
          <h3 className={ styles.title }>{ title }</h3>
          { subtitle && <h4 className={ styles.subtitle }>{ subtitle }</h4> }
        </div>
      </header>
      <div className={ clsx(styles.body, !isOpened && styles.hidden) }>
        { addresses && (
          <Subgroup icon={ 'geo' } className={ styles.subgroup }>
            { addresses.map((a: AddressInfo, i: number) => <Address key={ i } { ...a } />) }
          </Subgroup>
        ) }
        { phones && (
          <Subgroup icon='phone' className={ styles.subgroup }>
            { phones.map((p: PhoneInfo, i: number) => <Phone key={ i } { ...p } />) }
          </Subgroup>
        ) }
        { messengers && (
          <Subgroup icon='chat' className={ styles.subgroup }>
            { messengers.map((m: MessengerInfo, i: number) => <Messenger key={ i } { ...m } />) }
          </Subgroup>
        ) }
        { urls && (
          <Subgroup icon='chat' className={ styles.subgroup }>
            { urls.map((w: WebsiteInfo, i: number) => <WebLink key={ i } { ...w } />) }
          </Subgroup>
        ) }
      </div>
    </article>
  );
};
