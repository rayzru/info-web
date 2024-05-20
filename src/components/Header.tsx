
import React from 'react';
import { Menu } from '@mui/icons-material';
import { AppBar, Box, Button, Container, Drawer, Icon, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/session';
import { PropsWithStyles } from '@/types';

import { Logo } from './Logo';

import styles from './Header.module.scss';

interface NavInterface {
  title: string;
  href: string;
}

const navigation: NavInterface[] = [
  {
    title: 'Справка',
    href: '/',
  },
  {
    title: 'Парковки',
    href: '/parking',
  },
  {
    title: 'Правила',
    href: '/rules',
  },
  {
    title: 'Сообщество',
    href: '/about',
  },
];

interface Props extends PropsWithStyles {
  window?: () => Window;
}

export const Header = async ({ window }: Props) => {
  // const { data: session, status } = useSession();

  // console.log(session, status);

  // const pathname = usePathname();
  const pathname = '/';
  const drawerWidth = 240;
  const session = await getCurrentUser();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar component="nav" color='transparent' elevation={ 0 } position='relative'>
        <Container maxWidth="lg">
          <Toolbar >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={ handleDrawerToggle }
              sx={ { mr: 2, display: { sm: 'none' } } }
            >
              <Menu />
            </IconButton>
            <Icon
              className={ styles.logo }
              sx={ { display: { xs: 'none', sm: 'block' } } }>
              <Logo type='root' alt='Логотип' style={ { marginTop: 3 } } />
            </Icon>
            <Box sx={ { display: { xs: 'none', sm: 'block' } } }>
              <div className={ styles.navWrapper }>
                { navigation.map(({ title, href }: NavInterface) => (pathname === href || (pathname.startsWith(href) && href !== '/'))
                  ? (<Button variant='text' color='secondary' key={ title }>{ title }</Button>)
                  : (<Button component={ Link } variant='text' href={ href } key={ title }>{ title }</Button>),
                ) }
              </div>
            </Box>
            <Box sx={ { ml: 'auto' } } >
              { session
                ? (<Button href="/my" color="inherit">Профиль</Button>)
                : (
                  <>
                    <Button href="/login" color="inherit">Войти</Button>
                    <Button href="/register" color="inherit">Регистрация</Button>
                  </>
                ) }
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer
          container={ container }
          variant="temporary"
          open={ mobileOpen }
          onClose={ handleDrawerToggle }
          ModalProps={ {
            keepMounted: true, // Better open performance on mobile.
          } }
          sx={ {
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          } }
        >
          <Box onClick={ handleDrawerToggle }>
            <List>
              { navigation.map((item) => (
                <ListItem
                  key={ item.href }
                  disablePadding
                >
                  <ListItemButton
                    component="a"
                    href={ item.href }
                  >
                    <ListItemText primary={ item.title } />
                  </ListItemButton>
                </ListItem>
              )) }
            </List>
          </Box>
        </Drawer>
      </nav>
    </>
  );
};
