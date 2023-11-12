'use client';

import { AndroidOutlined, Apple, Link } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { BaseListItem } from '@/components/list/BaseListItem';
import { WebsiteInfo } from '@/types';

interface Props extends WebsiteInfo {
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

export const WebLink = ({ url, title, ...props }: Props) => {



  return (
    <BaseListItem actions={ [] } icon={ getItemIcon(url) } { ...props } >
      <Tooltip title={ ['Перейти по ссылке', <div key='url'>{ url }</div>] }>
        <a target='_blank' href={ url }>{ title ?? url }</a>
      </Tooltip>
    </BaseListItem>
  );
};
