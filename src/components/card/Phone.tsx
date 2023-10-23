'use client';

import { useRef } from 'react';

import { Action, Base } from '@/components/card/Base';
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
      callback: () => { linkRef?.current?.click(); }
    },
    {
      icon: 'copy',
      label: 'Скопировать',
      callback: () => copy(phone)
    },
  ];

  return (
    <Base icon={ 'phone' } actions={ actions } { ...props } >
      { phone && (
        <>
          <a ref={ linkRef } className={ styles.phone } href={ `tel:${phone}` }>{ phone }</a>
        </>
      ) }
    </Base>
  );
};