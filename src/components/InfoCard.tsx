'use client';

import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import { Card, CardContent, CardHeader, IconButton, List, Menu, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import useLocalStorage from '@/hooks/use-local-storage';
import { AddressInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles, WebsiteInfo } from '@/types';

import { Address } from './list/Address';
import { Messenger } from './list/Messenger';
import { Phone } from './list/Phone';
import { WebLink } from './list/WebLink';
import { Logo } from './Logo';

interface Props extends PropsWithChildren, PropsWithStyles {
  info: GroupInfo;
  singleCard?: boolean;
}

const StyledCard = styled(Card)`
  &:hover {
    box-shadow: 0 0 4px rgba(0,12,88,0.2);
  }
`;

export const InfoCard = ({ info, singleCard = false }: Props) => {
  const { id, title, subtitle, logo, addresses, phones, messengers, urls, rows = 1, } = info;
  const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setIsOpened] = useState(singleCard);
  const [, copy] = useCopyToClipboard();
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (copiedState) {
      setTimeout(() => setCopiedState(false), 4000);
    }
  }, [copiedState]);

  const router = useRouter();

  useEffect(() => {
    setIsOpened(singleCard || isOpenedInitially);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = () => {
    if (singleCard) {
      return;
    }
    updateSettings(!isOpened);
    setIsOpened(prev => !prev);
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCopiedState(true);
    copy(window.location.href + id);
    handleClose();
  };

  const handleOpenPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/' + id);
  };

  return (
    <>
      <Menu
        anchorEl={ anchorEl }
        open={ Boolean(anchorEl) }
        onClose={ handleClose }
        keepMounted
      >
        <MenuItem onClick={ handleShare }>Скопировать</MenuItem>
        <MenuItem onClick={ handleOpenPage }>Открыть</MenuItem>
      </Menu>
      <StyledCard style={ { gridRow: `span ${isOpened ? rows : 1}` } } >
        { !singleCard && (
          <CardHeader
            sx={ { cursor: 'pointer' } }
            avatar={ logo && (<Logo alt={ title } type={ logo } />) }
            onClick={ handleChange }
            title={
              <Typography variant='h2' fontSize={ 18 }>{ title }</Typography>
            }
            subheader={ <Typography variant='h3' color={ 'text.secondary' } fontSize={ 16 }>{ subtitle }</Typography> }
            action={ (
              <IconButton onClick={ handleMenu }  >
                <MoreVert />
              </IconButton>
            ) }
          />
        ) }
        { isOpened && (
          <CardContent >
            <List >
              { addresses?.map((a: AddressInfo, i: number) => <Address key={ i } { ...a } />) }
              { phones?.map((p: PhoneInfo, i: number) => <Phone key={ i } { ...p } />) }
              { messengers?.map((m: MessengerInfo, i: number) => <Messenger key={ i } { ...m } />) }
              { urls?.map((w: WebsiteInfo, i: number) => <WebLink key={ i } { ...w } />) }
            </List>
          </CardContent>
        ) }
      </StyledCard>
    </>
  );
};
