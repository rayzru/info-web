'use client';

import React, { useState } from 'react';
import { AssignmentLate, AssignmentLateOutlined, EditNoteOutlined, FilterList, Forum, ForumOutlined, Info, InfoOutlined, LocalParking, LocalParkingOutlined, QuestionMark } from '@mui/icons-material';
import { AppBar, Box, Button, Icon, IconButton, Toolbar } from '@mui/material';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PropsWithStyles } from '@/types';

import Search from './search/Search';
import { Logo } from './Logo';
import { ThanxModal } from './ThanxModal';

import styles from './Header.module.scss';

interface NavInterface {
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  href: string;
}

interface Props extends PropsWithStyles {
  showSettingsButton?: boolean;
  showSearch?: boolean;
  showBack?: boolean;
  onSettings?: () => void;
}

export const Header = ({
  showSearch = false,
  showSettingsButton = true,
  onSettings,
}: Props) => {

  const pathname = usePathname();
  const [open10x, setOpen10x] = useState(false);

  function handleOpen10x(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setOpen10x(true);
  }

  const navigation: NavInterface[] = [
    {
      icon: <Logo type='root' alt='Логотип' style={ { marginTop: 3 } } />,
      title: 'Справочник',
      href: '/',
    },
    {
      icon: <LocalParkingOutlined />,
      title: 'Парковки',
      href: '/parking',
    },
    {
      icon: <ForumOutlined />,
      title: 'Чаты',
      href: '/chats',
    },
    {
      icon: <AssignmentLateOutlined />,
      title: 'Правила',
      href: '/rules',
    },
    {
      icon: <QuestionMark />,
      title: <>O&nbsp;нас</>,
      href: '/about',
    },
  ];



  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar component="nav" color='transparent' elevation={ 0 } position='relative'>
        <Toolbar >
          <Icon
            className={ styles.logo }
            sx={ { display: { xs: 'none', sm: 'block' } } }>
            <Logo type='root' alt='Логотип' style={ { marginTop: 3 } } />
          </Icon>
          <div className={ styles.navWrapper }>
            { navigation.map(({ title, href, icon }: NavInterface) => (pathname === href || (pathname.startsWith(href) && href !== '/'))
              ? (<span key={ title } className={ clsx(styles.nav, styles.active) }>
                <Box sx={ { display: { xs: 'none', sm: 'block' } } }>{ title }</Box>
                <Box sx={ { display: { xs: 'block', sm: 'none' } } }>{ icon }</Box>
              </span>)
              : (<Link href={ href } className={ styles.nav } key={ title }>
                <Box sx={ { display: { xs: 'none', sm: 'block' } } }>{ title }</Box>
                <Box sx={ { display: { xs: 'block', sm: 'none' } } }>{ icon }</Box>
              </Link>),
            ) }
          </div>

          <Box sx={ { display: { xs: 'none', sm: 'block' } } }>
            <Button size='small' variant='outlined' onClick={ handleOpen10x } sx={ { marginLeft: 2 } }>Предложить...</Button>
          </Box>
          <Box sx={ { display: { xs: 'block', sm: 'none' } } }>
            <IconButton title='Предложить' sx={ { marginLeft: 2 } } onClick={ handleOpen10x }><EditNoteOutlined /></IconButton>
          </Box>

          { showSearch && <Search /> }
          { showSettingsButton && (
            <IconButton onClick={ onSettings } style={ { marginLeft: 'auto' } }>
              <FilterList />
            </IconButton>
          ) }
        </Toolbar>
      </AppBar>
      <ThanxModal closeHandler={ () => setOpen10x(false) } open={ open10x } />

    </Box>
  );
};
