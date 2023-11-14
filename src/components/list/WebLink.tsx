'use client';

import { AndroidOutlined, Apple, Link } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { BaseListItem } from '@/components/list/BaseListItem';
import { IterableInfo, WebsiteInfo } from '@/types';

import { WrappedIcon } from '../WrappedIcon';

interface Props extends WebsiteInfo, IterableInfo {
  title?: string;
}


function getItemIcon(url: string) {
  if (url.startsWith('https://apps.apple.com')) {
    return <Apple />;
  }
  if (url.startsWith('https://play.google.com')) {
    return <AndroidOutlined />;
  }
  return <Link />;
}

export const WebLink = ({ onClick, iconUrl, url, title, ...props }: Props) => {
  return (
    <BaseListItem actions={ [] } icon={ iconUrl ? <WrappedIcon onClick={ onClick } path={ iconUrl }>{ getItemIcon(url) }</WrappedIcon> : getItemIcon(url) } { ...props } >
      <Tooltip title={ ['Перейти по ссылке', <div key='url'>{ url }</div>] }>
        <a target='_blank' href={ url }>{ title ?? url }</a>
      </Tooltip>
    </BaseListItem>
  );
};
