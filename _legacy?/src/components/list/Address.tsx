'use client';

import { Map, Room } from '@mui/icons-material';

import { AddressInfo, IterableInfo } from '@/types';

import { Action, BaseListItem } from './BaseListItem';


interface Props extends AddressInfo, IterableInfo {
  title?: string;
}

export const Address = ({ address, floor, office, maps, ...props }: Props) => {

  const addressString = [
    address,
    floor && `${floor}‑й этаж`,
    office && `оф. ${office}`
  ]
    .filter(Boolean)
    .map((el, i: number) => el && (<span key={ i } className='commaList'>{ el }</span>));

  const actions: Action[] = getMapActions(maps);

  return (
    <BaseListItem actions={ actions } icon={ <Room /> }   { ...props }>
      { addressString }
    </BaseListItem >
  );

  function getMapActions(maps: string[] = []): Action[] {
    return maps?.reduce<Action[]>((actions: Action[], url: string) => {
      if (url.startsWith('https://yandex.ru/maps/')) {
        actions.push({
          icon: <Map />,
          label: 'Открыть Яндекс.Карты',
          href: url,
        });
      }
      return actions;
    }, []);
  }
};
