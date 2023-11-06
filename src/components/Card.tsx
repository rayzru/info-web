'use client';

import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import useLocalStorage from '@/hooks/use-local-storage';
import { AddressInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles, WebsiteInfo } from '@/types';

import { Address } from './Address';
import { Button } from './Button';
import { Logo } from './Logo';
import { Messenger } from './Messenger';
import { Phone } from './Phone';
import { Subgroup } from './Subgroup';
import { WebLink } from './WebLink';

import styles from './Card.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles {
  info: GroupInfo;
  singleCard?: boolean;
}

export const Card = ({ className, info, singleCard = false }: Props) => {
  const { id, title, subtitle, logo, addresses, phones, messengers, color, urls, rows = 1, } = info;
  const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setOpened] = useState(singleCard);
  const [, copy] = useCopyToClipboard();
  const [copiedState, setCopiedState] = useState<boolean>(false);

  useEffect(() => {
    if (copiedState) {
      setTimeout(() => setCopiedState(false), 4000);
    }
  }, [copiedState]);

  const router = useRouter();

  useEffect(() => {
    setOpened(singleCard || isOpenedInitially);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = () => {
    if (singleCard) {
      return;
    }
    updateSettings(!isOpened);
    setOpened(prev => !prev);
  };

  const handleShare = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCopiedState(true);
    copy(window.location.href + id);
  };

  const handleOpenPage = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/' + id);
  }

  return (
    <article
      className={ clsx(
        styles.card,
        className,
        isOpened && styles[`span${rows}`],
        singleCard && styles.singleCard,
      ) }
      style={ { backgroundColor: color } }
    >
      { !singleCard && (
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
          <div className={ styles.buttons }>
            <Button
              icon='arrow-up'
              data-tooltip-content={ `Открыть страницу "${title}"` }
              onClick={ handleOpenPage }
            />
            <Button
              icon='share'
              onClick={ handleShare }
              data-tooltip-content={ copiedState ? '✅ Скопировано' : 'Скопровать прямую ссылку на карточку' }
            />
          </div>
        </header>
      ) }
      <div className={ clsx(
        styles.body,
        !isOpened && styles.hidden,
        singleCard && styles.noHeader,
      ) }>
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
