'use client';

import { Telegram, WhatsApp } from '@mui/icons-material';
import { Avatar, Card, CardHeader } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import Link from 'next/link';


interface Props {
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
}

export const ChatCard = ({ title, subtitle, url }: Props) => {

  const isTelegram = url.includes('//t.me');

  return (
    <Card
      variant='outlined'
      raised={ false }
      component={ 'a' }
      href={ url }
      sx={ { textDecoration: 'none', flex: 1, minWidth: 250, maxWidth: 250 } }
    >
      <CardHeader
        avatar={
          <Avatar
            sizes='small'
            variant='rounded'
            sx={ { bgcolor: isTelegram ? blue[500] : green[500] } }
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
    </Card>
  );
};
