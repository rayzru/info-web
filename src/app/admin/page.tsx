import React, { PropsWithChildren } from 'react';
import { AppBar, Box, CssBaseline, Divider, Drawer, List, Toolbar, Typography } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Console',
  description: 'Сердце Ростова 2',
};

export interface Props extends PropsWithChildren { }

const drawerWidth = 250;

export default function Admin({ children }: Props) {
  return (
    <Box sx={ { display: 'flex' } }>
      <CssBaseline />
      <Drawer
        sx={ {
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        } }
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>

        </List>

        <Box
          component="main"
          sx={ { flexGrow: 1, bgcolor: 'background.default', p: 3 } }
        >
          <Toolbar />

        </Box>
      </Drawer>
    </Box>

  );
}
