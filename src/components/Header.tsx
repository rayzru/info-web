'use client';

import { useState } from 'react';
import { FilterList } from '@mui/icons-material';
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
  title: string;
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
      title: 'Справочник',
      href: '/',
    },
    {
      title: 'Парковки',
      href: '/parking',
    },
    {
      title: 'Чаты',
      href: '/chats',
    },
    {
      title: 'Правила',
      href: '/rules',
    },
    {
      title: 'О нас',
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
            { navigation.map(({ title, href }: NavInterface) => (pathname === href || (pathname.startsWith(href) && href !== '/'))
              ? (<span key={ title } className={ clsx(styles.nav, styles.active) }>{ title }</span>)
              : (<Link href={ href } className={ styles.nav } key={ title }>{ title }</Link>),
            ) }
          </div>
          <Button size='small' variant='outlined' onClick={ handleOpen10x }>Предложить...</Button>
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
