'use client';

import { PhoneOutlined, Telegram, WhatsApp } from '@mui/icons-material';

import { Action, BaseListItem } from '@/components/list/BaseListItem';
import { cleanupPhone } from '@/helpers';
import { PhoneInfo } from '@/types';

interface Props extends PhoneInfo {
  title?: string;
}

export const Phone = ({ phone, ...props }: Props) => {

  const actions: Action[] = [];

  if (props.hasWhatsApp) {
    actions.unshift({
      href: `https://wa.me/${cleanupPhone(phone)}`,
      label: 'WhatsApp',
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
    <BaseListItem actions={ actions } icon={ <PhoneOutlined /> } { ...props } >
      <a target='_blank' href={ `tel:${cleanupPhone(phone)}` }>
        { phone }
      </a>
    </BaseListItem>
  );
};
