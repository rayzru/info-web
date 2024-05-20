'use client';

import { Suspense, useState } from 'react';
import { Container, Grid } from '@mui/material';

import { ParkingCard } from '@/components/ParkingCard';
import { ParkingCardNew } from '@/components/ParkingCardNew';
import ParkingFilter, { FilterFn } from '@/components/parkingFilter/ParkingFilter';
import parking from '@/data/parking';
import { ParkingOfferInfo } from '@/types';

export default function Parking() {
  const sorted = parking
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.parkingNumber - b.parkingNumber)
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.building - b.building);

  const [data, setData] = useState<ParkingOfferInfo[]>(sorted);

  function onFilter(fn: FilterFn): void {
    setData(sorted.filter(fn))
  }

  return (
    <Container maxWidth="lg">
      <Suspense>
        <ParkingFilter onFilter={ onFilter } />
      </Suspense>
      <Grid container spacing={ 2 } sx={ { mt: 2 } }>
        { data.map((el: ParkingOfferInfo) => (
          <Grid
            key={ el.offer.type + el.building.toString() + el.parkingNumber.toString() + el.level.toString() }
            item
            xs={ 12 }
            sm={ 6 }
            md={ 4 }
          >
            <ParkingCard
              info={ el }
            />
          </Grid>
        )) }
      </Grid>
    </Container>
  );
}
