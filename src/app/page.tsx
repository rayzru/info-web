'use client';

import { useState } from 'react';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { InfoGrid } from '@/components/InfoGrid';
import { SupportCard } from '@/components/SupportCard';
import data from '@/data';
import useLocalStorage from '@/hooks/use-local-storage';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [isVisibleInitially] = useLocalStorage<string>('visible', '');
  const [checkState] = useState<string[]>(
    isVisibleInitially === '' ? data.map(v => v.id) : isVisibleInitially.split(',')
  );

  return (
    <main className={ styles.main }>
      <Header subtitle={ [] } />
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo) => checkState.includes(el.id) && <Card key={ el.id } info={ el } />) }
        <SupportCard />
      </InfoGrid>
      {/* <Map className={ styles.map } /> */ }
    </main >
  );
}
