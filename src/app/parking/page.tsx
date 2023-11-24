'use client';

import { Header } from '@/components/Header';
import { InfoGrid } from '@/components/InfoGrid';
import { ParkingCard } from '@/components/ParkingCard';
import parking from '@/data/parking';
import { ParkingOfferInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {

  return (
    <main className={ styles.main }>
      <Header title='Парковки' className={ styles.header } subtitle={ [] } showSearch={ false } showSettingsButton={ false } />
      <InfoGrid className={ styles.cards }>
        { parking.map((el: ParkingOfferInfo) => <ParkingCard key={ el.id } info={ el } />) }
      </InfoGrid>
    </main >
  );
}
