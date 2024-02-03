'use client';

import { Telegram, WhatsApp } from '@mui/icons-material';
import { Avatar, Card, CardHeader } from '@mui/material';
import { blue, green } from '@mui/material/colors';

import styles from './ChatCard.module.scss';


interface Props {
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
}

export const ChatCard = ({ title, subtitle, url }: Props) => {

  const isTelegram = url.includes('//t.me');

  return (
    <CardHeader
      component={ 'a' }
      href={ url }
      className={ styles.chatCard }
      sx={ { padding: 0 } }
      avatar={
        <Avatar
          sizes='small'
          variant='rounded'
          sx={ { bgcolor: isTelegram ? blue[500] : green[500], marginRight: 0 } }
        >
          { isTelegram
            ? <Telegram fontSize='small' />
            : <WhatsApp fontSize='small' />
          }
        </Avatar>
      }
      title={ title }
      subheader={ subtitle }
    />
  );
};
