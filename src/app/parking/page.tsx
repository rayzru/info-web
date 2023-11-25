'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { ApartmentOutlined } from '@mui/icons-material';
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { Header } from '@/components/Header';
import { ParkingCard } from '@/components/ParkingCard';
import { ParkingGrid } from '@/components/ParkingGrid';
import parking from '@/data/parking';
import { Offer, ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [buildingsFilter, setBuildingsFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [data, setData] = useState<ParkingOfferInfo[]>(parking);

  const handleBuildings = (e: MouseEvent<HTMLElement>, newValue: string[]) => setBuildingsFilter(() => newValue || []);
  const handleTypes = (e: MouseEvent<HTMLElement>, newValue: string[]) => setTypeFilter(() => newValue || []);

  const filterFn = (el: ParkingOfferInfo) => {
    return true
      && (
        (typeFilter.length == 0 || typeFilter.length == 2) ||
        el.offers.some((o: Offer) => typeFilter.includes(o.type))
      )
      && (
        (buildingsFilter.length == 0 || buildingsFilter.length == 4) ||
        buildingsFilter.includes(String(el.building))
      );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setData(parking.filter(filterFn)), [buildingsFilter, typeFilter])

  return (
    <main className={ styles.main }>
      <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />
      <Stack direction="row" spacing={ 2 } className={ styles.filters }>
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

        <ToggleButtonGroup
          size='small'
          value={ buildingsFilter }
          onChange={ handleBuildings }
        >
          <ToggleButton value={ '-' } disabled key={ 'i' }>
            <ApartmentOutlined fontSize='inherit' />
          </ToggleButton>
          { [1, 2, 6, 7].map((building: number) => (
            <ToggleButton key={ String(building) } value={ String(building) }>
              <Typography fontSize={ 13 } fontWeight={ 600 }>{ building }</Typography>
            </ToggleButton>
          )) }
        </ToggleButtonGroup>
      </Stack>
      <ParkingGrid className={ styles.cards }>
        { data.map((el: ParkingOfferInfo, index: number) => <ParkingCard key={ index } info={ el } />) }
      </ParkingGrid>
    </main >
  );
}