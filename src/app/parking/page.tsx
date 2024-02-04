'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { AddOutlined, CancelOutlined, RestoreOutlined, Sell } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
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
  const searchParams = useSearchParams();
  const pathName = usePathname() || '/'
  const router = useRouter();

  const initialType: string[] = searchParams.get('type') !== null
    ? searchParams.get('type')?.split(',') as string[]
    : [];
  const initialBuilding: string[] = searchParams.get('buildings') !== null
    ? searchParams.get('buildings')?.split(',') as string[]
    : [];

  const hasInitialFilters = initialType.length > 0 || initialBuilding.length > 0;

  const initFilterState: ParkingFilters = { type: [], buildings: [] };
  console.log(searchParams.get('type'), searchParams.get('buildings'));
  const [filter, setFilter] = useState<ParkingFilters>({ type: initialType, buildings: initialBuilding });
  const [overlay, setOverlay] = useState<boolean>(hasInitialFilters);

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
      setOverlay(false);
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
          <Tooltip title="Фильтрация по типу объявления">
            <ToggleButtonGroup
              size="small"
              value={ filter.type }
              onChange={ handleTypes }
            >
              { ['rent', 'sell'].map((t: string) => (
                <ToggleButton
                  key={ t }
                  value={ t }
                  color={ t === 'rent' ? 'success' : 'warning' }
                >
                  <Box sx={ { display: { xs: 'none', sm: 'flex' } } }>
                    { t === 'rent' && 'Аренда' }
                    { t === 'sell' && 'Продажа' }
                  </Box>
                  <Box sx={ { display: { xs: 'flex', sm: 'none' } } }>
                    { t === 'rent' && <RestoreOutlined fontSize={ 'small' } /> }
                    { t === 'sell' && <Sell fontSize={ 'small' } /> }
                  </Box>
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
              { [1, 2, 6, 7].map((building: number) => (
                <ToggleButton
                  key={ String(building) }
                  value={ String(building) }
                >
                  { building }
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
              sx={ { width: 32, height: 32, marginLeft: '0!important' } }
            >
              <CancelOutlined fontSize='small' />
            </IconButton>
          </Tooltip>

          <Box sx={ { display: { xs: 'none', sm: 'block', marginLeft: 'auto!important' } } }>
            <Tooltip title="Добавить объявление">
              <Button
                href="/parking/request"
                color="primary"
                variant="outlined"
              >
                Добавить
              </Button>
            </Tooltip>
          </Box>
          <Box sx={ { display: { xs: 'block', sm: 'none', marginLeft: 'auto!important' } } }>
            <Tooltip title="Добавить объявление">
              <IconButton
                href="/parking/request"
                color="primary"
              >
                <AddOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>

        </Stack>
        <ParkingGrid className={ styles.cards }>
          { overlay && (
            <div className={ styles.overlay }>
              <LoadingButton loading size='large' />
            </div>
          ) }
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
