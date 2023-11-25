'use client';

import { PropsWithChildren, ReactNode } from 'react';
import { CurrencyRubleOutlined, Telegram, WhatsApp } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, IconButton, List, Typography } from '@mui/material';

import { cleanupPhone, formatPhone } from '@/helpers';
import { MessengerInfo, Offer, ParkingOfferInfo, PhoneInfo } from '@/types';

interface Props extends PropsWithChildren {
  info: ParkingOfferInfo;
  skipCopy?: boolean;
  singleCard?: boolean;
}

export const ParkingCard = ({ info, singleCard = false }: Props) => {
  const { building, level, offers, parkingNumber, phones, messengers } = info;

  const subtitle = `Cтр. ${building}, этаж ${level}, место ${parkingNumber}`;

  return (
    <Card sx={ { position: 'relative' } }>
      <Chip
        size='small'
        variant='outlined'
        color='default'
        label={ `#P${building}${level}${String(parkingNumber).padStart(3, '0')}` }
        sx={ { position: 'absolute', right: '8px', top: '8px', opacity: .3 } }
      />
      { !singleCard && (
        <CardHeader
          title={
            <div>
              P{ building }
              <span style={ { opacity: .3, fontWeight: 100 } }> / </span>
              { level }
              <span style={ { opacity: .3, fontWeight: 100 } }> / </span>
              { String(parkingNumber).padStart(3, '0') }
            </div>
          }
          titleTypographyProps={ {
            variant: 'h2',
            fontWeight: 900,
            fontSize: 28,
          } }
          subheader={ subtitle }
          subheaderTypographyProps={ {
            noWrap: true,
            textOverflow: 'ellipsis',
            color: 'text.secondary',
            marginTop: 1,
            fontSize: 14,
            textTransform: 'uppercase',
          } }
        />
      ) }

      { offers.map((offer: Offer) => (
        <>
          <Divider sx={ { marginTop: 2 } } />
          <CardContent sx={ { paddingBottom: 0 } }>
            <Chip
              sx={ { position: 'absolute', marginTop: '-28px' } }
              label={ offer.type === 'rent' ? 'Аренда' : 'Продажа' }
              size='small'
              color={ offer.type === 'rent' ? 'success' : 'warning' }
            />
            <Typography fontSize={ 33 } sx={ { marginTop: '20px' } }>
              { offer.price }<CurrencyRubleOutlined fontSize={ 'small' } />
              { offer.type === 'rent' && (
                <Typography color={ 'text.secondary' } variant='caption' fontSize={ 16 }>
                  { offer.perTimeRange === 'month' && 'в месяц' }
                  { offer.perTimeRange === 'year' && 'в год' }
                </Typography>
              ) }
            </Typography>
          </CardContent>
        </>
      )) }

      <CardActions>
        { phones?.reduce((acc: ReactNode[], p: PhoneInfo) => (
          [
            ...acc,
            p.phone && <Button variant='text' color='inherit' sx={ { marginRight: 'auto' } } href={ `tel:${cleanupPhone(p.phone)}` }>{ formatPhone(p.phone) }</Button>,
            p.hasWhatsApp && <IconButton href={ `https://wa.me/${cleanupPhone(p.phone)}` }><WhatsApp /></IconButton>,
            p.hasTelegram && <IconButton href={ `https://wa.me/${cleanupPhone(p.phone)}` }><Telegram /></IconButton>
          ]
        ), []) }
        { messengers?.reduce((acc: ReactNode[], m: MessengerInfo) => (
          [
            ...acc,
            m.messengerType === 'telegram' && <IconButton href={ m.link }><Telegram /></IconButton>,
            m.messengerType === 'whatsapp' && <IconButton href={ m.link }><WhatsApp /></IconButton>,
          ]
        ), []) }
      </CardActions>
    </Card>
  );
};
