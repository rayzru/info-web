'use client';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { AddressInfo } from '@/types';

import { Action, Base } from './Base';

import styles from './Address.module.scss';

interface Props extends AddressInfo {
    title: string;
}

export const Address = ({
  address,
  city,
  floor,
  office,
  postcode,
  maps,
  ...baseProps
}: Props) => {
  const [, copy] = useCopyToClipboard();

  const adressString = [
    address,
    floor && `${floor}-й этаж`,
    office && `оф. ${office}`,
  ].filter(Boolean).join(', ');

  const copyString = [
    postcode,
    city,
    address,
    floor && `${floor}-й этаж`,
    office && `оф. ${office}`,
  ].filter(Boolean).join(', ');

  const actions: Action[] = [
    ...getMapActions(maps),
    {
      icon: 'copy',
      label: 'Скопировать',
      callback: () => copy(copyString)
    },
  ];

  return (
    <Base actions={ actions } { ...baseProps }>
      { address && <p className={ styles.address }>{ adressString } </p> }
    </Base>
  );

  function getMapActions(maps: string[] = []): Action[] {
    return maps?.reduce<Action[]>((actions: Action[], url: string) => {
      if (url.startsWith('https://yandex.ru/maps/')) {
        actions.push({
          icon: 'yandex-maps',
          label: 'Яндекс',
          href: url,
        });
      }
      return actions;
    }, []);
  }
};
