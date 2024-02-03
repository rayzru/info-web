'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { ApartmentOutlined, CancelOutlined } from '@mui/icons-material';
import { Button, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ParkingCard } from '@/components/ParkingCard';
import { ParkingCardNew } from '@/components/ParkingCardNew';
import { ParkingGrid } from '@/components/ParkingGrid';
import parking from '@/data/parking';
import { ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';

interface ParkingFilters {
  type: string[];
  buildings: string[];
}

export default function Parking() {
  const initFilterState: ParkingFilters = { type: [], buildings: [] };
  const [filter, setFilter] = useState<ParkingFilters>(initFilterState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname() || '/'


  const sorted = parking
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.parkingNumber - b.parkingNumber)
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.building - b.building);
  const [data, setData] = useState<ParkingOfferInfo[]>(sorted);

  const handleBuildings = (_e: MouseEvent<HTMLElement>, newValue: string[]) => setFilter({ ...filter, buildings: newValue });
  const handleTypes = (_e: MouseEvent<HTMLElement>, newValue: string[]) => setFilter({ ...filter, type: newValue });

  async function resetFilters(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setFilter(initFilterState);
  }

  const filterFn = (el: ParkingOfferInfo) => {
    return (
      filter.type && ([0, 2].includes(filter.type.length) || filter.type.includes(el.offer.type)) &&
      filter.buildings && ([0, 4].includes(filter.buildings.length) || filter.buildings.includes(String(el.building)))
    );
  };

  useEffect(
    () => {
      setData(parking.filter(filterFn));
      if (filter.type.length === 0 && filter.buildings.length === 0) {
        router.push(pathName, { scroll: false });
      } else {
        const serializedFilter = Object.entries(filter)
          .map(([key, val]) => val.length !== 0 ? `${key}=${val}` : undefined)
          .filter(Boolean).join('&');
        router.push(`${pathName}?${serializedFilter}`, { scroll: false });
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );

  return (
    <>
      <main className={ styles.main }>
        <Header
          className={ styles.header }
          showSearch={ false }
          showSettingsButton={ false }
        />
        <Stack direction="row" spacing={ 2 } className={ styles.filters }>
          <Tooltip title="Фильтрация по типу">
            <ToggleButtonGroup
              size="small"
              value={ filter.type }
              onChange={ handleTypes }
            >
              { ['rent', 'sell'].map((t: string) => (
                <ToggleButton key={ t } value={ t }>
                  <Typography fontSize={ 13 }>
                    { t === 'rent' && 'Аренда' }
                    { t === 'sell' && 'Продажа' }
                  </Typography>
                </ToggleButton>
              )) }
            </ToggleButtonGroup>
          </Tooltip>
          <Tooltip title="Фильтрация по номеру строения">
            <ToggleButtonGroup
              size="small"
              value={ filter.buildings }
              onChange={ handleBuildings }
            >
              <ToggleButton value={ '-' } disabled key={ 'i' }>
                <ApartmentOutlined sx={ { fontSize: 20, opacity: 0.5 } } />
              </ToggleButton>
              { [1, 2, 6, 7].map((building: number) => (
                <ToggleButton key={ String(building) } value={ String(building) }>
                  <Typography fontSize={ 16 } fontWeight={ 600 }>
                    { building }
                  </Typography>
                </ToggleButton>
              )) }
            </ToggleButtonGroup>
          </Tooltip>
          <Tooltip title="Сбросить фильтры">
            <IconButton
              color="error"
              size="small"
              disabled={ filter.type.length === 0 && filter.buildings.length === 0 }
              onClick={ resetFilters }
              sx={ { width: 32, height: 32 } }
            >
              <CancelOutlined fontSize='small' />
            </IconButton>
          </Tooltip>

          <Button
            href="/parking/request"
            color="primary"
            variant="outlined"
            className={ styles.requestButton }
          >
            Добавить
          </Button>
        </Stack>
        <ParkingGrid className={ styles.cards }>
          { data.map((el: ParkingOfferInfo) => (
            <ParkingCard
              key={ el.offer.type + el.building.toString() + el.parkingNumber.toString() + el.level.toString() }
              info={ el }
            />
          )) }
          <ParkingCardNew key={ 'newCard' } />
        </ParkingGrid>
      </main>
      <Footer />
    </>
  );
}
