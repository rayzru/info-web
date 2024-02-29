'use client';

import { Suspense, useState } from 'react';
import { LoadingButton } from '@mui/lab';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ParkingCard } from '@/components/ParkingCard';
import { ParkingCardNew } from '@/components/ParkingCardNew';
import ParkingFilter from '@/components/parkingFilter/ParkingFilter';
import { FilterFn } from '@/components/parkingFilter/tyles';
import { ParkingGrid } from '@/components/ParkingGrid';
import parking from '@/data/parking';
import { ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';

export default function Parking() {

  const sorted = parking
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.parkingNumber - b.parkingNumber)
    .sort((a: ParkingOfferInfo, b: ParkingOfferInfo) => a.building - b.building);

  const [data, setData] = useState<ParkingOfferInfo[]>(sorted);
  const [overlay, setOverlay] = useState<boolean>(false);

  function onFilter(fn: FilterFn): void {
    setData(sorted.filter(fn))
  }

  return (
    <>
      <main className={ styles.main }>
        <Header
          className={ styles.header }
          showSearch={ false }
          showSettingsButton={ false }
        />

        <Suspense>
          <ParkingFilter onFilter={ onFilter } onOverlay={ (o: boolean) => setOverlay(o) } />
        </Suspense>
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
