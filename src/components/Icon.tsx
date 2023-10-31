import { PropsWithStyles } from '@/types';

export type IconType =
    | 'geo'
    | 'phone'
    | 'chat'
    | 'copy'
    | 'yandex-maps'
    | 'telegram'
    | 'whatsapp';

interface Props extends PropsWithStyles {
  type: IconType;
}

export const Icon = ({ type, className }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <svg className={ className } width={ 24 } height={ 24 } viewBox='0 0 16 16'>
      <use href={ `/icons/icons.svg#${type}` } />
    </svg>
  );
};
