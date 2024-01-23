'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { ApartmentOutlined, Cancel, CancelOutlined } from '@mui/icons-material';
import { Button, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { parseAsArrayOf, parseAsInteger, parseAsNumberLiteral, parseAsString, useQueryState } from 'next-usequerystate';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ParkingCard } from '@/components/ParkingCard';
import { ParkingCardNew } from '@/components/ParkingCardNew';
import { ParkingGrid } from '@/components/ParkingGrid';
import parking from '@/data/parking';
import { ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';


export default function Parking() {
  const [typeFilter, setTypeFilter] = useQueryState<string[]>('type', parseAsArrayOf(parseAsString).withDefault([]));
  const [buildingsFilter, setBuildingsFilter] = useQueryState<string[]>('buildings', parseAsArrayOf(parseAsString).withDefault([]));

  const sorted = parking
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.parkingNumber - b.parkingNumber)
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.building - b.building)
    ;

  const [data, setData] = useState<ParkingOfferInfo[]>(sorted);

  const handleBuildings = (e: MouseEvent<HTMLElement>, newValue: string[]) => setBuildingsFilter(newValue);
  const handleTypes = (e: MouseEvent<HTMLElement>, newValue: string[]) => setTypeFilter(newValue);

  const resetFilters = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setBuildingsFilter([]);
    setTypeFilter([]);
  }

  const filterFn = (el: ParkingOfferInfo) => {
    return true
      && typeFilter && ([0, 2].includes(typeFilter.length) || typeFilter.includes(el.offer.type))
      && buildingsFilter && ([0, 4].includes(buildingsFilter.length) || buildingsFilter.includes(String(el.building)));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setData(parking.filter(filterFn)), [buildingsFilter, typeFilter])

  return (
    <>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />
        <Stack direction="row" spacing={ 2 } className={ styles.filters }>
          <Tooltip title="Фильтрация по типу">
            <ToggleButtonGroup
              size='small'
              value={ typeFilter }
              onChange={ handleTypes }
            >
              { ['rent', 'sell'].map(
                (t: string) => (
                  <ToggleButton key={ t } value={ t }>
                    <Typography fontSize={ 13 } >
                      { t === 'rent' && 'Аренда' }
                      { t === 'sell' && 'Продажа' }
                    </Typography>
                  </ToggleButton>
                )) }
            </ToggleButtonGroup>
          </Tooltip>
          <Tooltip title="Фильтрация по номеру строения">
            <ToggleButtonGroup
              size='small'
              value={ buildingsFilter }
              onChange={ handleBuildings }
            >
              <ToggleButton value={ '-' } disabled key={ 'i' }>
                <ApartmentOutlined sx={ { fontSize: 20, opacity: .5 } } />
              </ToggleButton>
              { [1, 2, 6, 7].map((building: number) => (
                <ToggleButton key={ String(building) } value={ String(building) } >
                  <Typography fontSize={ 16 } fontWeight={ 600 }>{ building }</Typography>
                </ToggleButton>
              )) }
            </ToggleButtonGroup>
          </Tooltip>
          { (typeFilter.length > 0 || buildingsFilter.length > 0) && (
            <Tooltip title="Сбросить фильтры">
              <IconButton size='small' onClick={ resetFilters }   >
                <CancelOutlined />
              </IconButton>
            </Tooltip>
          ) }

          <Button
            href='/parking/request' color='primary' variant='outlined'
            className={ styles.requestButton }
          >
            Добавить свое объявление
          </Button>
        </Stack>
        <ParkingGrid className={ styles.cards }>
          { data.map((el: ParkingOfferInfo, index: number) => <ParkingCard key={ index } info={ el } />) }
          <ParkingCardNew />
        </ParkingGrid>
      </main >
      <Footer />
    </>
  );
}
