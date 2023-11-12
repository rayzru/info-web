import { Avatar } from '@mui/material';

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
  | 'beeline'
  | 'domru'
  | 'taimer'
  | 'vodokanal'
  | 'ts-ug'
  | 'recycle';

interface Props extends PropsWithStyles {
    type: LogoType;
    alt?: string;
}

export const Logo = ({ type, alt, style }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Avatar
      style={ style }
      sx={ { bgcolor: 'transparent', width: 24, height: 'fit-content' } }
      src={ `/logos/${type}.svg` }
      alt={ alt }
      variant="square"
    >
    </Avatar>
  );
};
