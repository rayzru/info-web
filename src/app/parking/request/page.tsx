'use client';

import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { CurrencyRuble } from '@mui/icons-material';
import {
  Alert,
  Box, Button, FormControl, FormControlLabel, FormGroup, FormHelperText, Input,
  InputAdornment, InputLabel, MenuItem, Modal, Paper, Select, SelectChangeEvent,
  Switch, TextField, Typography
} from '@mui/material';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import PhoneInput from '@/components/PhoneInput';
import { modalStyles, ThanxModal } from '@/components/ThanxModal';
import { cleanupPhone } from '@/helpers';
import { Building, Offer, ParkingLevel, ParkingOfferInfo, PhoneInfo } from '@/types';

import styles from './page.module.scss';

const initData: Partial<ParkingOfferInfo> = {
  variant: 'standard',
};

export default function Parking() {
  const [data, setData] = useState<Partial<ParkingOfferInfo>>(initData);

  const [sendEnabled, setSendEnabled] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const [open10x, setOpen10x] = useState(false);

  function handleOpen10x(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setOpen10x(true);
  }

  const handleClose = (event: {},
    reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  useEffect(() => {
    const state = Boolean(
      data.building
      && data.level
      && data.parkingNumber
      && data.parkingNumber > 0
      && data.contact
      && data.contact.phone
      && cleanupPhone(data.contact.phone).length === 12
      && data.offer
      && data.offer.type
      && data.offer.price
      && data.offer.price > 0
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
        phone: e.target.value,
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
        description: e.target.value
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

  return (
    <>
      <Modal
        open={ open }
        onClose={ handleClose }
      >
        <Box sx={ modalStyles }>
          <Typography variant="h6" component="h2">
              Ваша заявка оформлена и отправлена администратору на рассмотрение
          </Typography>
          <Typography sx={ { mt: 2 } }>
              Рассмотрение заявки может занять какое-то время. Как правило это не более 1 суток.
          </Typography>
          <Typography sx={ { mt: 2 } }>
              Далнейшие изменения или удаления вашей заявки выполняются на данный момент администратором.
              Пишите в <a href='https://t.me/rayzru'>Telegram</a>
          </Typography>
          <div>
            <Button variant='outlined' href='/parking'>Закрыть</Button>
          </div>
        </Box>
      </Modal>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />

        <form className={ styles.wrapper }>
          <div className={ styles.info }>
            <h1 className={ styles.title }>Добавление нового объявления</h1>
            <p>На сегодняшний день добавление информации в раздел Парковка производится вручную через форму.</p>
            <p>Дальнейшее сопровождение, обновление информации, изменение цены или сняние объявление производится по прямому обращению к администратору в месседжерах или по телефону.</p>
            <p>В случае удачной сделки, успешной сдачи в аренду или продажи, не забывайте, пожалуйств, изменять статус вашего объявления.</p>
            <p>Если вы хотели бы выразить благодарность, <a href="#" onClick={ handleOpen10x }>скажите спасибо</a> и/или
              <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>поддержите разработчиков в виде посильного пожертвования</a>.
            </p>
            <ThanxModal closeHandler={ () => setOpen10x(false) } open={ open10x } />
          </div>
          <Paper className={ styles.form }>
            <div className={ styles.column1 }>
              <FormControl variant='standard' required={ true }>
                <InputLabel>Ларина 45, Строение ...</InputLabel>
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
              <Box display={ 'flex' } gap={ 2 }>
                <FormControl variant='standard' sx={ { flex: 1 } }>
                  <InputLabel>Этаж</InputLabel>
                  <Select
                    value={ data?.level?.toString() }
                    onChange={ handleLevelChange }
                    placeholder='Выберите этаж парковки'
                  >
                    <MenuItem value={ -1 }>-1 Этаж</MenuItem>
                    <MenuItem value={ -2 }>-2 Этаж</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={ { flex: 1 } }
                  required={ true }
                  InputProps={ {
                    startAdornment: <InputAdornment position="start">№</InputAdornment>,
                  } }
                  label="Номер" variant='standard' onChange={ handleParkingChange } type='number'
                />
              </Box>
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
                minRows={ 2 }
                multiline={ true }
                onChange={ handleOfferDescriptionChange }
              />
            </div>
            <div className={ styles.column2 }>
              <FormControl variant="standard" required={ true }>
                <InputLabel htmlFor="contact-phone">Контактный телефон</InputLabel>
                <Input
                  required={ true }
                  onChange={ handlePhoneChange }
                  inputComponent={ PhoneInput as any }
                />
                <FormHelperText>
                  <Alert severity='warning'>
                    Внимательно проверьте правильность номера. Этот номер будет использоваться в качестве вашего контактного телефона.
                  </Alert>
                </FormHelperText>
              </FormControl>
              <Typography variant='body2'>
              Если к вашему контактному телефону привязаны аккаунты месседжеров,
                они будут указаны в качестве альтернативных способов связи.
              </Typography>
              <FormGroup row >
                <FormControlLabel
                  control={ <Switch onChange={ handleHasTelegram } /> }
                  label={ 'Telegram' }
                  name='hasTelegram'
                />
                <FormControlLabel control={ <Switch onChange={ handleHasWhatsApp } /> } label="WhatsApp" name='hasWhatsApp' />
              </FormGroup>
            </div>
            <div className={ styles.buttons }>
              <Button onClick={ handleSend } variant='contained' disabled={ !sendEnabled } sx={ { width: '200px' } }>Отправить заявку</Button>
            </div>
          </Paper>
        </form>
      </main >
      <Footer />
    </>
  );
}
