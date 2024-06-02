import React from 'react';
import { Box, CssBaseline, Divider, Drawer, List, Toolbar } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Console',
  description: 'Сердце Ростова 2',
};

const drawerWidth = 250;

export default function Admin() {
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
