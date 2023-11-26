'use client';

import { PropsWithChildren, ReactNode } from 'react';
import { CurrencyRubleOutlined, InfoOutlined, Telegram, WhatsApp } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import { cleanupPhone, formatPhone } from '@/helpers';
import { MessengerInfo, Offer, ParkingOfferInfo, PhoneInfo } from '@/types';

interface Props extends PropsWithChildren {
  info: ParkingOfferInfo;
  skipCopy?: boolean;
  singleCard?: boolean;
}

export const ParkingCard = ({ info }: Props) => {
  const { building, level, offer, parkingNumber, contact } = info;

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
      <CardActions sx={ { marginTop: 'auto' } }>
        { contact.phone && <Button variant='text' key='phone' color='inherit' sx={ { marginRight: 'auto', whiteSpace: 'nowrap' } } href={ `tel:${cleanupPhone(contact.phone)}` }>{ formatPhone(contact.phone) }</Button> }
        { contact.hasWhatsApp && <IconButton key='whatsapp' size='small' href={ `https://wa.me/${cleanupPhone(contact.phone)}` }><WhatsApp /></IconButton> }
        { contact.hasTelegram && <IconButton key='telegram' size='small' href={ `https://t.me/${cleanupPhone(contact.phone)}` }><Telegram /></IconButton> }
      </CardActions>
    </Card>
  );
};
