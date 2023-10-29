'use client';

import { useRef } from 'react';

import { Action, Base } from '@/components/Base';
import { cleanupPhone } from '@/helpers';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { PhoneInfo } from '@/types';

import styles from './Phone.module.scss';

interface Props extends PhoneInfo {
  title: string;
}

export const Phone = ({ phone, ...props }: Props) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [, copy] = useCopyToClipboard();

  const actions: Action[] = [
    {
      icon: 'phone',
      label: 'Позвонить',
      href: `tel:${cleanupPhone(phone)}`
    },
    {
      icon: 'copy',
      label: 'Скопировать',
      callback: () => copy(phone)
    },
  ];

  if (props.hasWhatsApp) {
    actions.unshift({
      href: `https://wa.me/${cleanupPhone(phone)}`,
      label: 'Telegram',
      icon: 'whatsapp'
    });
  }

  if (props.hasTelegram) {
    actions.unshift({
      href: `https://t.me/${cleanupPhone(phone)}`,
      label: 'Telegram',
      icon: 'telegram'
    });
  }

  return (
    <Base actions={ actions } { ...props } >
      { phone && (
        <>
          <a ref={ linkRef } target='_blank' className={ styles.phone } href={ `tel:${phone}` }>{ phone }</a>
        </>
      ) }
    </Base>
  );
};