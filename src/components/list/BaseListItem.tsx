'use client';

import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

import { BaseInfo } from '@/types';

export interface Action {
  icon?: ReactNode;
  label?: string;
  href?: string;
  callback?: MouseEventHandler<HTMLAnchorElement>;
  tooltip?: string;
}

interface Props extends BaseInfo, PropsWithChildren {
  actions?: Action[];
  icon?: ReactNode;
  showIcon?: boolean;
}

export const BaseListItem = ({
  title,
  icon,
  subtitle,
  children,
  showIcon = true,
  actions = [],
}: Props) => {
  return (
    <ListItem secondaryAction={ (
      <>
        { actions.map(
          (action: Action, i: number) => (
            <IconButton
              href={ action.href ?? '' }
              key={ i }
              title={ action.label }
              onClick={ action.callback }
            >
              { action.icon }
            </IconButton>
          )
        ) }
      </>
    ) }>
      <ListItemIcon color='secondary'>
        { showIcon && icon }
      </ListItemIcon>
      <ListItemText primary={ children } secondary={ (
        <>
          <Typography color={ 'text.secondary' }>{ title }</Typography>
          { subtitle }
        </>
      ) } />
    </ListItem>
  );
}

