'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { Card, CardHeader, List } from '@mui/material';
import { styled } from '@mui/material/styles';

// import useLocalStorage from '@/hooks/use-local-storage';
import { AddressInfo, BaseInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles, TextInfo, WebsiteInfo } from '@/types';

import { Address } from './list/Address';
import { Messenger } from './list/Messenger';
import { Phone } from './list/Phone';
import { Text } from './list/Text';
import { WebLink } from './list/WebLink';
import { Logo } from './Logo';

interface Props extends PropsWithChildren, PropsWithStyles {
  info: GroupInfo;
  skipCopy?: boolean;
  onCopyUrl?: () => void;
}

const StyledCard = styled(Card)`
  position: relative;
`;

export const InfoCard = ({ info, style }: Props) => {
  const { title, subtitle, logo, addresses, phones, messengers, urls, texts, rows = 1, } = info;
  // const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setIsOpened] = useState(false);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  useEffect(() => {
    if (copiedState) {
      setTimeout(() => setCopiedState(false), 4000);
    }
  }, [copiedState]);


  const handleChange = () => {
    setIsOpened(prev => !prev);
  };

  const filterVisible = (el: BaseInfo) => el.visible === undefined || el.visible !== false;

  const contentStyle = { paddingTop: 0 };
  const wrapperStyle = {
    gridRow: `span ${isOpened ? rows : 1}`,
    ...contentStyle,
    ...style
  };

  return (
    <StyledCard style={ wrapperStyle } variant='outlined' >
      <CardHeader
        sx={ {
          cursor: 'pointer',
          '& .MuiCardHeader-content': {
            display: 'block',
            overflow: 'hidden',
          },
        } }
        avatar={ logo && (<Logo alt={ title } type={ logo } />) }
        onClick={ handleChange }
        title={ title }
        titleTypographyProps={ {
          variant: 'h2',
          fontSize: 16,
        } }
        subheader={ subtitle }
        subheaderTypographyProps={ {
          noWrap: true,
          textOverflow: 'ellipsis',
          variant: 'h3',
          fontSize: 12,
          color: 'text.secondary'
        } }
      />
      { isOpened && (
        <List >
          { addresses?.filter(filterVisible).map((a: AddressInfo, i: number) => <Address key={ i } { ...a } />) }
          { phones?.filter(filterVisible).map((p: PhoneInfo, i: number) => <Phone key={ i } { ...p } />) }
          { messengers?.filter(filterVisible).map((m: MessengerInfo, i: number) => <Messenger key={ i } { ...m } />) }
          { urls?.filter(filterVisible).map((w: WebsiteInfo, i: number) => <WebLink key={ i } { ...w } />) }
          { texts?.filter(filterVisible).map((t: TextInfo, i: number) => <Text key={ i } { ...t } />) }
        </List>
      ) }
    </StyledCard>
  );
};
