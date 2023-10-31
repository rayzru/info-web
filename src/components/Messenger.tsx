'use client';


import { Action, Base } from '@/components/Base';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { MessengerInfo } from '@/types';

import { IconType } from './Icon';

interface Props extends MessengerInfo {
  title?: string;
}

export const Messenger = ({ mesengerType, link, title, ...props }: Props) => {
  const [, copy] = useCopyToClipboard();

  const actions: Action[] = [
    {
      icon: mesengerType as IconType,
      label: 'Открыть',
      href: 'link'
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
          <a target='_blank' href={ link }>{ title }</a>
        </>
      ) }
    </Base>
  );

};
