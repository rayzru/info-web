'use client';

import { FilterList } from '@mui/icons-material';
import { AppBar, Box, Icon, IconButton, Toolbar } from '@mui/material';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PropsWithStyles } from '@/types';

import Search from './search/Search';
import { Logo } from './Logo';

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
      title: 'Сообщество',
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
          { showSearch && <Search /> }
          { showSettingsButton && (
            <IconButton onClick={ onSettings } style={ { marginLeft: 'auto' } }>
              <FilterList />
            </IconButton>
          ) }
        </Toolbar>
      </AppBar>
    </Box>
  );
};
