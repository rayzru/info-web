import { CSSProperties } from 'react';
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
  width?: CSSProperties['width'];
}

export const Logo = ({ type, alt, style, width = 24 }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Avatar
      style={ style }
      sx={ { bgcolor: 'transparent', width, height: 'fit-content' } }
      src={ `/logos/${type}.svg` }
      alt={ alt }
      variant="square"
    >
    </Avatar>
  );
};
