'use client';

import { ReactNode } from 'react';
import { Chat, Telegram, WhatsApp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { BaseListItem } from '@/components/list/BaseListItem';
import { IterableInfo, MessengerInfo } from '@/types';

import { IconType } from '../Icon';
import { WrappedIcon } from '../WrappedIcon';

interface Props extends MessengerInfo, IterableInfo {
  title?: string;
}

function getMessengerIcon(type: IconType): ReactNode {

  switch (type) {
    case 'telegram': return <Telegram />;
    case 'whatsapp': return <WhatsApp />;
    default: return <Chat />;
  }

}

export const Messenger = ({ onClick, iconUrl, messengerType, link, title, ...props }: Props) => {

  return (
    <BaseListItem icon={ iconUrl ? <WrappedIcon onClick={ onClick } path={ iconUrl }>{ getMessengerIcon(messengerType) }</WrappedIcon> : getMessengerIcon(messengerType) } { ...props } >
      <Tooltip title={ 'Открыть чат' } >
        <a target='_blank' href={ link }>{ title }</a>
      </Tooltip>
    </BaseListItem>
  );

};
