'use client';

import { ChangeEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

import { AddressInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles } from '@/types';

import { Address } from './Address';
import { Logo } from './Logo';
import { Messenger } from './Messenger';
import { Phone } from './Phone';
import { Subgroup } from './Subgroup';

import styles from './Card.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles {
    info: GroupInfo;
}

export const Card = ({ className, info }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);
  const { title, subtitle, logo, addresses, phones, messengers, id, color, rows: settingsRows = 1 } = info;
  const [rows, setRows] = useState(1);

  useEffect(() => { });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRows(event.target.checked ? settingsRows : 1);
  };

  return (
    <article className={ clsx(styles.card, className) } style={ { backgroundColor: color, gridRow: `span ${rows}` } }>
      <label className={ styles.headerWrapper } htmlFor={ `check-${id}` }>
        <header className={ styles.header }>
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
      </label>
      <input type='checkbox' className={ styles.toggle } id={ `check-${id}` } ref={ toggleRef } onChange={ handleChange } />
      <div className={ styles.body }>
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
      </div>
    </article>
  );
};