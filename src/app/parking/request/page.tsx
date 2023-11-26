'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CurrencyRuble } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, FormControl, FormControlLabel, FormGroup, Input, InputAdornment, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';

import { Header } from '@/components/Header';
import PhoneInput from '@/components/PhoneInput';
import { Building, Offer, ParkingLevel, ParkingOfferInfo, PhoneInfo } from '@/types';

import styles from './page.module.scss';

const initData: Partial<ParkingOfferInfo> = {
  variant: 'standard',
};

export default function Parking() {
  const [data, setData] = useState<Partial<ParkingOfferInfo>>(initData);

  const [sendEnabled, setSendEnabled] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event: {},
    reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleCloseAndReset = () => {
    setData({});
    setOpen(false);
  };

  useEffect(() => {
    const state = Boolean(
      data.building
      && data.level
      && data.contact
      && data.offer,
    );
    setSendEnabled(state);
  }, [data]);

  const handleBuildingChange = (e: SelectChangeEvent) => {
    setData({ ...data, building: Number(e.target.value) as Building });
  };

  const handleLevelChange = (e: SelectChangeEvent) => {
    setData({ ...data, level: Number(e.target.value) as ParkingLevel });
  };

  const handleParkingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, parkingNumber: Number(e.target.value) as ParkingLevel });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      contact: {
        ...data.contact,
        phone: e.target.value as string,
      }
    });
  };

  const handleOfferTypeChange = (e: SelectChangeEvent) => {
    setData({
      ...data,
      offer: {
        ...data.offer,
        type: e.target.value as Offer['type']
      } as Offer
    });
  };

  const handleOfferDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      offer: {
        ...data.offer,
        description: e.target.value as Offer['description']
      } as Offer
    });
  };

  const handleOfferPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      offer: {
        ...data.offer,
        price: Number(e.target.value) || 0 as Offer['price']
      } as Offer
    });
  };

  const handleHasTelegram = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setData({
      ...data, contact: {
        ...data.contact,
        hasTelegram: checked,
      } as PhoneInfo
    });
  };

  const handleHasWhatsApp = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setData({
      ...data, contact: {
        ...data.contact,
        hasWhatsApp: checked,
      } as PhoneInfo
    });
  };

  const handleSend = () => {
    const body = JSON.stringify({
      ...data,
      dateUpdated: new Date().getTime()
    });
    fetch('/api/message', { method: 'POST', body }).then((res) => {
      setOpen(true);
      console.log(res);
    });
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <main className={ styles.main }>
      <Modal
        open={ open }
        onClose={ handleClose }
      >
        <Box sx={ style }>
          <Typography variant="h6" component="h2">
            Ваша заявка оформлена и отправлена администратору на рассмотрение
          </Typography>
          <Typography sx={ { mt: 2 } }>
            Рассмотрение заявки может занять какое-то время. Как правило это не более 1 суток.
          </Typography>
          <Button href='/parking'>Закрыть</Button>
          <Button onClick={ handleCloseAndReset }>Составить еще одну заявку</Button>
        </Box>
      </Modal>
      <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />
      <form className={ styles.form }>
        <div className={ styles.group }>
          <Typography variant='h5'>Парковочное место</Typography>
          <FormControl variant='standard' required={ true }>
            <InputLabel>Строение</InputLabel>
            <Select
              value={ data?.building?.toString() }
              onChange={ handleBuildingChange }
              placeholder='Выберите строение'
            >
              <MenuItem value={ 1 }>Строение 1 (литеры 4, 5)</MenuItem>
              <MenuItem value={ 2 }>Строение 2 (литеры 2, 3)</MenuItem>
              <MenuItem value={ 6 }>Строение 6 (литеры 7)</MenuItem>
              <MenuItem value={ 7 }>Строение 7 (литеры 6)</MenuItem>
            </Select>
          </FormControl>
          { data?.building && [1, 2].includes(data?.building) && (
            <FormControl variant='standard'>
              <InputLabel>Этаж</InputLabel>
              <Select
                value={ data?.level?.toString() }
                onChange={ handleLevelChange }
                defaultValue={ '-1' }
                placeholder='Выберите этаж парковки'
              >
                <MenuItem value={ -1 }>-1 Этаж</MenuItem>
                <MenuItem value={ -2 }>-2 Этаж</MenuItem>
              </Select>
            </FormControl>
          ) }
          <TextField
            required={ true }
            InputProps={ {
              startAdornment: <InputAdornment position="start">№</InputAdornment>,
            } }
            label="Номер парковочного места" variant='standard' onChange={ handleParkingChange } type='number'
          />
        </div>
        <div className={ styles.group }>
          <Typography variant='h5'>Предложение</Typography>
          <FormControl variant='standard'>
            <InputLabel>Тип объявления</InputLabel>
            <Select
              onChange={ handleOfferTypeChange }
              defaultValue={ '-' }
              placeholder='Выберите этаж парковки'
            >
              <MenuItem value={ 'rent' }>Сдаю в аренду</MenuItem>
              <MenuItem value={ 'sell' }>Продаю</MenuItem>
            </Select>
          </FormControl>

          { data.offer?.type && (
            <TextField
              InputProps={ {
                endAdornment: (
                  <InputAdornment position="end">
                    <CurrencyRuble />
                  </InputAdornment>
                ),
              } }
              label={ data.offer?.type === 'sell' ? 'Стоимость сделки' : 'Стоимость аренды в месяц' }
              variant='standard'
              onChange={ handleOfferPriceChange }
              type='tel'
              helperText={ data.offer?.type === 'rent' ? 'Стоимость указывается с учетом коммунальных платежей' : '' }
            />
          ) }

          <TextField
            label={ 'Дополнительная информация' }
            variant='standard'
            onChange={ handleOfferDescriptionChange }
          />
        </div>
        <div className={ styles.group }>
          <Typography variant='h5'>Контакты</Typography>
          <FormControl variant="standard">
            <InputLabel htmlFor="contact-phone">Контактный телефон</InputLabel>
            <Input
              onChange={ handlePhoneChange }
              id="contact-phone"
              inputComponent={ PhoneInput as any }
            />
          </FormControl>
          <FormGroup >
            <FormControlLabel control={ <Switch onChange={ handleHasTelegram } /> } label="Telegram" name='hasTelegram' />
            <FormControlLabel control={ <Switch onChange={ handleHasWhatsApp } /> } label="WhatsApp" name='hasWhatsApp' />
          </FormGroup>
          <Typography variant='body2'>
            Если к вашему контактному телефону привязаны аккаунты месседжеров,
            их так же можно указать в качестве альтернативных способов связи
          </Typography>
        </div>
      </form>
      <div className={ styles.form }>
        <Button variant='outlined' color='secondary' href='/parking'  >Отмена</Button>
        <Button onClick={ handleSend } variant='contained' disabled={ !sendEnabled }>Отправить заявку</Button>
        <Button onClick={ handleCloseAndReset } >Сброс</Button>
      </div>
    </main >
  );
}
