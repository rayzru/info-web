'use client';

import { PhoneOutlined, Telegram, WhatsApp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { Action, BaseListItem } from '@/components/list/BaseListItem';
import { cleanupPhone } from '@/helpers';
import { IterableInfo, PhoneInfo } from '@/types';

import { WrappedIcon } from '../WrappedIcon';

interface Props extends PhoneInfo, IterableInfo {
  title?: string;
}

export const Phone = ({ onClick, iconUrl, phone, ...props }: Props) => {

  const actions: Action[] = [];

  if (props.hasWhatsApp) {
    actions.unshift({
      href: `https://wa.me/${cleanupPhone(phone)}`,
      label: 'Открыть чат WhatsApp',
      icon: <WhatsApp />
    });
  }

  if (props.hasTelegram) {
    actions.unshift({
      href: `https://t.me/${cleanupPhone(phone)}`,
      label: 'Telegram',
      icon: <Telegram />
    });
  }

  return (
    <BaseListItem actions={ actions } icon={ iconUrl ? <WrappedIcon onClick={ onClick } path={ iconUrl }><PhoneOutlined /></WrappedIcon> : <PhoneOutlined /> } { ...props } >
      <Tooltip title="Позвонить">
        <a target='_blank' href={ `tel:${cleanupPhone(phone)}` }>
          { phone }
        </a>
      </Tooltip >
    </BaseListItem>
  );
};
