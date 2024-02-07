'use client';

import { ReactNode, useState } from 'react';
import { Snackbar } from '@mui/material';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { InfoCard } from '@/components/InfoCard';
import { InfoGrid } from '@/components/InfoGrid';
import SettingsDrawer from '@/components/SettingsDrawer';
import data from '@/data';
import useLocalStorage from '@/hooks/use-local-storage';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [hidden, setHidden] = useLocalStorage<string>('hidden', '');
  const checkState = hidden.split(',');
  const [openSettings, setOpenSettings] = useState(false);
  const [snack, setSnack] = useState<ReactNode | string>('');

  function handleToggleSettings() {
    setOpenSettings(prev => !prev);
  }

  function handleUpdate(value: string) {
    setHidden(value);
  }

  function handleCloseSnackbar() {
    setSnack('');
  }

  function handleCopyUrl() {
    setSnack(<>Ссылка на информацию скопирована</>);
  }

  return (
    <>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } onSettings={ handleToggleSettings } />
        <InfoGrid className={ styles.cards }>
          { data.map((el: GroupInfo) => !checkState.includes(el.id) && <InfoCard onCopyUrl={ handleCopyUrl } key={ el.id } info={ el } />) }
        </InfoGrid>
        {/* <Map className={ styles.map } /> */ }
        <SettingsDrawer value={ checkState } onUpdate={ handleUpdate } onClose={ handleToggleSettings } isOpened={ openSettings } />
        <Snackbar
          open={ Boolean(snack) }
          autoHideDuration={ 2000 }
          onClose={ handleCloseSnackbar }
          message={ snack }
        />
      </main >
      <Footer />
    </>
  );
}
