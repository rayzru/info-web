'use client';

import { useMemo, useState } from 'react';

import { Header } from '@/components/Header';
import { InfoCard } from '@/components/InfoCard';
import { InfoGrid } from '@/components/InfoGrid';
import SettingsDrawer from '@/components/SettingsDrawer';
import { SupportCard } from '@/components/SupportCard';
import data from '@/data';
import useLocalStorage from '@/hooks/use-local-storage';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [hidden, setHidden] = useLocalStorage<string>('hidden', '');
  const checkState = useMemo(() => hidden.split(',') || [], [hidden]);
  const [openSettings, setOpenSettings] = useState(false);

  function handleToggleSettings() {
    setOpenSettings(prev => !prev);
  }

  function handleUpdate(value: string) {
    setHidden(value);
  }

  return (
    <main className={ styles.main }>
      <Header className={ styles.header } subtitle={ [] } showSearch={ true } onSettings={ handleToggleSettings } />
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo) => !checkState.includes(el.id) && <InfoCard key={ el.id } info={ el } />) }
        <SupportCard />
      </InfoGrid>
      {/* <Map className={ styles.map } /> */ }
      <SettingsDrawer value={ hidden } onUpdate={ handleUpdate } onClose={ handleToggleSettings } isOpened={ openSettings } />
    </main >
  );
}
