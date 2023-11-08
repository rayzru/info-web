'use client';

import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { InfoGrid } from '@/components/InfoGrid';
import { SupportCard } from '@/components/SupportCard';
import data from '@/data';
import useLocalStorage from '@/hooks/use-local-storage';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [isHidden] = useLocalStorage<string>('hidden', '');
  const [checkState] = useState<string[]>(isHidden.split(',') || []);

  return (
    <main className={ styles.main }>
      <Header subtitle={ [] } />
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo) => !checkState.includes(el.id) && <Card key={ el.id } info={ el } />) }
        <SupportCard />
      </InfoGrid>
      {/* <Map className={ styles.map } /> */ }
      <Tooltip id="tooltip" />
    </main >
  );
}
