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

export const Logo = ({ type, alt }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Avatar
      sx={ { bgcolor: 'transparent', width: 24, height: 24 } }
      src={ `/logos/${type}.svg` }
      alt={ alt }
      variant="square"
    >
    </Avatar>
  );
};
