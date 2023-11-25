'use client';

import { PropsWithChildren, ReactNode } from 'react';
import { CurrencyRubleOutlined, Info, InfoOutlined, Telegram, WhatsApp } from '@mui/icons-material';
import { Badge, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Icon, IconButton, List, Tooltip, Typography } from '@mui/material';

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
    <Card sx={ {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    } }>
      <Chip
        size='small'
        variant='outlined'
        color='default'
        label={ `${building}${level.toString().slice(1, 2)}${String(parkingNumber).padStart(3, '0')}` }
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
          <CardContent sx={ { paddingBottom: 0 } }>
            <Box sx={ { display: 'flex', alignItems: 'center' } }>
              <Chip
                variant='outlined'
                label={ offer.type === 'rent' ? 'Аренда' : 'Продажа' }
                size='small'
                color={ offer.type === 'rent' ? 'success' : 'warning' }
              />
              { offer.type === 'rent' && (
                <Tooltip title={ 'Стоимость аренды включает в себя оплату коммунальных платежей' }>
                  <InfoOutlined color='disabled' sx={ { marginLeft: 1 } } />
                </Tooltip>
              ) }
            </Box>
            <Typography fontSize={ 33 } sx={ { marginTop: 1 } }>
              { offer.price }
              <CurrencyRubleOutlined fontSize={ 'small' } />
            </Typography>
            { offer.description && (
              <Typography variant='body2' color={ 'text.secondary ' }>
                { offer.description }
              </Typography>
            ) }

          </CardContent>
        </>
      )) }
      <CardActions sx={ { marginTop: 'auto' } }>
        { phones?.reduce((acc: ReactNode[], p: PhoneInfo) => (
          [
            ...acc,
            p.phone && <Button variant='text' color='inherit' sx={ { marginRight: 'auto', whiteSpace: 'nowrap' } } href={ `tel:${cleanupPhone(p.phone)}` }>{ formatPhone(p.phone) }</Button>,
            p.hasWhatsApp && <IconButton size='small' href={ `https://wa.me/${cleanupPhone(p.phone)}` }><WhatsApp /></IconButton>,
            p.hasTelegram && <IconButton size='small' href={ `https://wa.me/${cleanupPhone(p.phone)}` }><Telegram /></IconButton>
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
