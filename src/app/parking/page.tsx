'use client';

import { Suspense, useState } from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ParkingCard } from '@/components/ParkingCard';
import { ParkingCardNew } from '@/components/ParkingCardNew';
import ParkingFilter from '@/components/parkingFilter/ParkingFilter';
import { FilterFn } from '@/components/parkingFilter/tyles';
import { ParkingGrid } from '@/components/ParkingGrid';
import parking from '@/data/parking';
import { monthDiff } from '@/helpers';
import { ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';

type POI = ParkingOfferInfo;

export default function Parking() {
  const now = new Date();

  const sorted = parking
    .sort((a: POI, b: POI) => a.parkingNumber - b.parkingNumber)
    .sort((a: POI, b: POI) => a.building - b.building);

  const regrouped = [
    ...sorted.filter(
      (el: POI) => monthDiff(now, new Date(el.dateUpdated)) <= 1,
    ),
    ...sorted.filter((el: POI) => {
      const d = new Date(el.dateUpdated);
      return monthDiff(now, d) > 1 && monthDiff(now, d) <= 3;
    }),
  ];

  const [data, setData] = useState<POI[]>(regrouped);

  function onFilter(fn: FilterFn): void {
    setData(regrouped.filter(fn));
  }

  return (
    <>
      <main className={styles.main}>
        <Header
          className={styles.header}
          showSearch={false}
          showSettingsButton={false}
        />

        <Suspense>
          <ParkingFilter onFilter={onFilter} />
        </Suspense>
        <ParkingGrid className={styles.cards}>
          {data.map((el: ParkingOfferInfo, i: number) => (
            <ParkingCard
              key={
                el.offer.type +
                el.building.toString() +
                el.parkingNumber.toString() +
                el.level.toString() +
                i.toString()
              }
              info={el}
            />
          ))}
          <ParkingCardNew key={'newCard'} />
        </ParkingGrid>
      </main>
      <Footer />
    </>
  );
}
