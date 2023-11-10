import { ArrowBackIosNew, CloseFullscreen, CloseRounded } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Link from 'next/link'

import { PropsWithStyles } from '@/types';

import { LogoType } from './Logo';
import Search from './Search';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
  title?: string;
  subtitle?: string[];
  logo?: LogoType;
  showSettingsButton?: boolean;
  showSearch?: boolean;
  showBack?: boolean;
}

export const Header = ({
  className,
  title = 'Справочная',
  subtitle = [],
  logo = 'sr2',
  showSearch = true,
  showSettingsButton = true,
  showBack = false,

}: Props) => {
  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar component="nav" elevation={ 0 } position='relative'>
        <Toolbar>
          <Typography variant="h1" noWrap fontSize={ 24 }>
            { title }
          </Typography>
          { subtitle.map((s: string, i: number) => (
            <Typography
              className={ styles.subtitle }
              sx={ { marginLeft: 1 } }
              key={ `subtitle-${i}` }
              variant="h2"
              noWrap
              fontSize={ 20 }
            >
              { s }
            </Typography>)
          ) }
          <Box sx={ { flexGrow: 1 } } />
          { showSettingsButton && (
            <IconButton size="large" LinkComponent={ Link } href="/settings">
              <SettingsIcon fontSize='inherit' />
            </IconButton>
          ) }

          { showBack && (
            <IconButton size="large" LinkComponent={ Link } href='/'>
              <CloseRounded />
            </IconButton>
          ) }
        </Toolbar>
      </AppBar>
    </Box>

  );
};
