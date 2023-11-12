import { CloseRounded, FilterList } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Link from 'next/link'

import { PropsWithStyles } from '@/types';

import Search from './search/Search';
import { Logo, LogoType } from './Logo';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
  title?: string;
  subtitle?: string[];
  logo?: LogoType;
  showSettingsButton?: boolean;
  showSearch?: boolean;
  showBack?: boolean;
  onSettings?: () => void;
}

export const Header = ({
  title = 'Справочник',
  subtitle = [],
  logo = 'sr2',
  showSearch = false,
  showSettingsButton = true,
  showBack = false,
  onSettings
}: Props) => {
  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar component="nav" color='transparent' elevation={ 0 } position='relative'>
        <Toolbar>
          <Logo type={ logo } style={ { margin: '0 12px' } } />
          <Typography variant="h1" noWrap fontSize={ 20 }>
            { title }
          </Typography>
          { subtitle.map((s: string, i: number) => (
            <Typography
              className={ styles.subtitle }
              sx={ { marginLeft: 1 } }
              key={ `subtitle-${i}` }
              variant="h2"
              noWrap
              fontSize={ 18 }
            >
              { s }
            </Typography>)
          ) }
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
