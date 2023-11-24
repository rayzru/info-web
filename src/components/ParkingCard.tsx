'use client';

import { PropsWithChildren } from 'react';
import { Card, CardHeader, List } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GroupInfo, MessengerInfo, PhoneInfo } from '@/types';

import { Messenger } from './list/Messenger';
import { Phone } from './list/Phone';

interface Props extends PropsWithChildren {
  info: GroupInfo;
  skipCopy?: boolean;
  singleCard?: boolean;
  onCopyUrl?: () => void;
}

const StyledCard = styled(Card)`
  position: relative;

  &:hover {
    box-shadow: 0 0 4px rgba(0,12,88,0.2);
  }
`;

export const ParkingCard = ({ info, singleCard = false }: Props) => {
  const { id, title, subtitle, phones, messengers } = info;

  return (
    <StyledCard >
      { !singleCard && (
        <CardHeader
          sx={ {
            cursor: 'pointer',
            '& .MuiCardHeader-content': {
              display: 'block',
              overflow: 'hidden',
            },
          } }
          title={ title }
          titleTypographyProps={ {
            variant: 'h2',
            fontSize: 18,
          } }
          subheader={ subtitle }
          subheaderTypographyProps={ {
            noWrap: true,
            textOverflow: 'ellipsis',
            variant: 'h3',
            fontSize: 16,
            color: 'text.secondary'
          } }
        />
      ) }
      <List>
        { phones?.map((p: PhoneInfo, i: number) => <Phone key={ i } { ...p } />) }
        { messengers?.map((m: MessengerInfo, i: number) => <Messenger key={ i } { ...m } />) }
      </List>
    </StyledCard>
  );
};
