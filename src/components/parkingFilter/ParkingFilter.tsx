'use client';

import React, { MouseEvent, useEffect, useState } from 'react';
import { AddOutlined, CancelOutlined, RestoreOutlined, Sell } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ParkingOfferInfo } from '@/types';

export interface ParkingFilters {
  type: string[];
  buildings: string[];
}

// eslint-disable-next-line no-unused-vars
export type FilterFn = (el: ParkingOfferInfo) => boolean;
// eslint-disable-next-line no-unused-vars
export type OverlayFn = (overlay: boolean) => void;


interface Props {
  // eslint-disable-next-line no-unused-vars
  onFilter: (fn: FilterFn) => void;
}

export default function ParkingFilter(props: Props): React.JSX.Element {
  const { onFilter } = props;
  const searchParams = useSearchParams();
  const pathName = usePathname() || '/';
  const router = useRouter();

  const initialType: string[] = searchParams.get('type') !== null
    ? searchParams.get('type')?.split(',') as string[]
    : [];
  const initialBuilding: string[] = searchParams.get('buildings') !== null
    ? searchParams.get('buildings')?.split(',') as string[]
    : [];

  const initFilterState: ParkingFilters = { type: [], buildings: [] };
  const [filter, setFilter] = useState<ParkingFilters>({ type: initialType, buildings: initialBuilding });

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
      onFilter && onFilter(filterFn);
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

  const handleBuildings = (_e: MouseEvent<HTMLElement>, b: string[]) => setFilter({ ...filter, buildings: b });
  const handleTypes = (_e: MouseEvent<HTMLElement>, t: string[]) => setFilter({ ...filter, type: t });

  return (
    <Stack direction="row" spacing={ 2 }>
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
          disabled={ filter.type.length === 0 && filter.buildings.length === 0 }
          onClick={ resetFilters }
        >
          <CancelOutlined />
        </IconButton>
      </Tooltip>

      <Box sx={ { display: { xs: 'none', sm: 'block', marginLeft: 'auto!important' } } }>
        <Tooltip title="Добавить объявление">
          <Button
            href="/parking/request"
            color="success"
            variant="outlined"
            startIcon={ <AddOutlined fontSize='small' /> }

          >
            Разместить объявление
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
  );

}
