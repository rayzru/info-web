import { PropsWithStyles } from '@/types';

export type LogoType =
  | 'rnd'
  | 'msk'
  | 'sr2'
  | 'root'
  | 'teploservice'
  | 'tns'
  | 'gis'
  | 'vdome'
  | 'vodokanal';

interface Props extends PropsWithStyles {
    type: LogoType;
    alt?: string;
}

export const Logo = ({ type, className, alt }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={ className }
      src={ `/logos/${type}.svg` }
      alt={ alt }
    />
  );
};
