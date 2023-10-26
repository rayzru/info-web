'use client';

import { useRef } from 'react';

import { Action, Base } from '@/components/card/Base';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { MessengerInfo } from '@/types';

import { IconType } from './Icon';

interface Props extends MessengerInfo {
    title: string;
}

export const Messenger = ({ mesengerType, link, title, ...props }: Props) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [, copy] = useCopyToClipboard();

  const actions: Action[] = [
    {
      icon: mesengerType as IconType,
      label: 'Открыть',
      callback: () => { linkRef?.current?.click(); }
    },
    {
      icon: 'copy',
      label: 'Скопировать',
      callback: () => copy(link)
    },
  ];

  return (
    <Base actions={ actions } { ...props } title={ '' } >
      { link && (
        <>
          <a target='_blank' ref={ linkRef } href={ link }>{ title }</a>
        </>
      ) }
    </Base>
  );

};