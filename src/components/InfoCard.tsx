'use client';

import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';
import { MoreVert, OpenInBrowser, OpenInBrowserOutlined, Share, ShareOutlined } from '@mui/icons-material';
import { Avatar, Card, CardContent, CardHeader, IconButton, List, Menu, MenuItem } from '@mui/material';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import useLocalStorage from '@/hooks/use-local-storage';
import { AddressInfo, GroupInfo, MessengerInfo, PhoneInfo, PropsWithStyles, WebsiteInfo } from '@/types';

import { Address } from './Address';
import { Logo } from './Logo';
import { Messenger } from './Messenger';
import { Phone } from './Phone';
import { Subgroup } from './Subgroup';
import { WebLink } from './WebLink';

import styles from './InfoCard.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles {
  info: GroupInfo;
  singleCard?: boolean;
}

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
        <MenuItem onClick={ handleOpenPage }>Открыть</MenuItem>
        <MenuItem onClick={ handleShare }>Скопировать ссылку</MenuItem>
      </Menu>
      <Card style={ { gridRow: `span ${isOpened ? rows : 1}` } } >
        { !singleCard && (
          <CardHeader
            avatar={ logo && (<Logo alt={ title } type={ logo } />) }
            onClick={ handleChange }
            title={ title }
            subheader={ subtitle }
            action={ (
              <IconButton onClick={ handleMenu }  >
                <MoreVert />
              </IconButton>
            ) }
          />
        ) }
        { isOpened && (
          <CardContent>
            <List>
              { addresses && (
                <Subgroup icon={ 'geo' } className={ styles.subgroup }>
                  { addresses.map((a: AddressInfo, i: number) => <Address key={ i } { ...a } />) }
                </Subgroup>
              ) }
              { phones && (
                <Subgroup icon='phone' className={ styles.subgroup }>
                  { phones.map((p: PhoneInfo, i: number) => <Phone key={ i } { ...p } />) }
                </Subgroup>
              ) }
              { messengers && (
                <Subgroup icon='chat' className={ styles.subgroup }>
                  { messengers.map((m: MessengerInfo, i: number) => <Messenger key={ i } { ...m } />) }
                </Subgroup>
              ) }
              { urls && (
                <Subgroup icon='link' className={ styles.subgroup }>
                  { urls.map((w: WebsiteInfo, i: number) => <WebLink key={ i } { ...w } />) }
                </Subgroup>
              ) }
            </List>
          </CardContent>
        ) }
      </Card>
    </>

  );
};
