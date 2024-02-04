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
  singleCard?: boolean;
  onCopyUrl?: () => void;
}

const StyledCard = styled(Card)`
  position: relative;

  &:hover {
    box-shadow: 0 0 4px rgba(0,12,88,0.2);
  }
`;

export const InfoCard = ({ info, singleCard = false, style }: Props) => {
  const { title, subtitle, logo, addresses, phones, messengers, urls, texts, rows = 1, } = info;
  // const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setIsOpened] = useState(singleCard);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  useEffect(() => {
    if (copiedState) {
      setTimeout(() => setCopiedState(false), 4000);
    }
  }, [copiedState]);


  useEffect(() => {
    setIsOpened(singleCard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = () => {
    if (singleCard) {
      return;
    }
    // updateSettings(!isOpened);
    setIsOpened(prev => !prev);
  };

  const filterVisible = (el: BaseInfo) => el.visible === undefined || el.visible !== false;

  const contentStyle = singleCard ? {} : { paddingTop: 0 };
  const wrapperStyle = {
    gridRow: `span ${isOpened ? rows : 1}`,
    ...contentStyle,
    ...style
  };

  return (
    <StyledCard style={ wrapperStyle } >
      { !singleCard && (
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
