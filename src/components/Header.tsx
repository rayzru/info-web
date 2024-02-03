'use client';

import { CloseRounded, FilterList } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PropsWithStyles } from '@/types';

import Search from './search/Search';

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
  showBack = false,
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
        <Toolbar variant="dense">
          <div className={ styles.navWrapper }>
            { navigation.map(({ title, href }: NavInterface) => (pathname === href)
              ? (<span key={ title } className={ clsx(styles.nav, styles.active) }>{ title }</span>)
              : (
                <Link
                  href={ href }
                  className={ styles.nav }
                  key={ title }
                >
                  { title }
                </Link>),
            ) }
          </div>
          { showSearch && <Search /> }
          { showSettingsButton && (
            <IconButton onClick={ onSettings } style={ { marginLeft: 'auto' } }>
              <FilterList />
            </IconButton>
          ) }

          { showBack && (
            <IconButton LinkComponent={ Link } href='/' style={ { marginLeft: 'auto' } }>
              <CloseRounded />
            </IconButton>
          ) }
        </Toolbar>
      </AppBar>
    </Box>
  );
};
