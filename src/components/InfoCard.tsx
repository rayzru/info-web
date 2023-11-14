'use client';

import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import { Card, CardHeader, IconButton, List, Menu, MenuItem } from '@mui/material';
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

export const InfoCard = ({ info, singleCard = false, skipCopy = false, onCopyUrl, style }: Props) => {
  const { id, title, subtitle, logo, addresses, phones, messengers, urls, color, rows = 1, } = info;
  const [isOpenedInitially, updateSettings] = useLocalStorage<boolean>(`card_${id}`, false);
  const [isOpened, setIsOpened] = useState(singleCard);
  const [, copy] = useCopyToClipboard();
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (copiedState) {
      setTimeout(() => setCopiedState(false), 4000);
    }
  }, [copiedState]);


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

  const contentStyle = singleCard ? {} : { paddingTop: 0 };
  const wrapperStyle = {
    gridRow: `span ${isOpened ? rows : 1}`,
    ...contentStyle,
    ...style
  };

  return (
    <>
      <Menu
        anchorEl={ anchorEl }
        open={ Boolean(anchorEl) }
        onClose={ handleClose }
        keepMounted
      >
        <MenuItem onClick={ handleShare }>Скопировать ссылку</MenuItem>
        <MenuItem onClick={ handleOpenPage }>Открыть в отдельном окне</MenuItem>
      </Menu>
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
            action={ (
              <IconButton onClick={ handleMenu }  >
                <MoreVert />
              </IconButton>
            ) }
          />
        ) }
        { isOpened && (
          <List >
            { addresses?.map((a: AddressInfo, i: number) => <Address onClick={ onCopyUrl } iconUrl={ skipCopy ? '' : getUrl(id, 'addresses', i) } key={ i } { ...a } />) }
            { phones?.map((p: PhoneInfo, i: number) => <Phone onClick={ onCopyUrl } iconUrl={ skipCopy ? '' : getUrl(id, 'phones', i) } key={ i } { ...p } />) }
            { messengers?.map((m: MessengerInfo, i: number) => <Messenger onClick={ onCopyUrl } iconUrl={ skipCopy ? '' : getUrl(id, 'messengers', i) } key={ i } { ...m } />) }
            { urls?.map((w: WebsiteInfo, i: number) => <WebLink onClick={ onCopyUrl } iconUrl={ skipCopy ? '' : getUrl(id, 'urls', i) } key={ i } { ...w } />) }
          </List>
        ) }
      </StyledCard>
    </>
  );
};

function getUrl(id: string, dataType: string, index: number) {
  return document?.location.origin + '/' + [id, dataType, index + 1].join('/');
}
