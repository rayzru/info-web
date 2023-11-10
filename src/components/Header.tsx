import { ArrowBackIosNew } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, Divider, IconButton, MenuItem, Toolbar, Typography } from '@mui/material';
import { clsx } from 'clsx';
import Link from 'next/link'

import { PropsWithStyles } from '@/types';

import { Logo, LogoType } from './Logo';
import Search from './Search';
import Settings from './Settings';

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
          <Typography variant="h5" noWrap>
            { title }
          </Typography>
          { subtitle.map((s: string, i: number) => (<Typography key={ `subtitle-${i}` } variant="h6" noWrap>{ s }</Typography>)) }
          <Box sx={ { flexGrow: 1 } } />
          { showSettingsButton && (
            <MenuItem component={ Link } href="/settings" >
              <IconButton size="large" >
                <SettingsIcon fontSize='inherit' />
              </IconButton>
            </MenuItem>
          ) }

          { showBack && (
            <MenuItem component={ Link } href="/" >
              <IconButton size="large" >
                <ArrowBackIosNew />
              </IconButton>
            </MenuItem>
          ) }
        </Toolbar>
      </AppBar>
    </Box>

  );
};
