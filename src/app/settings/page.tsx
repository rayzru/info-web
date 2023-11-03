'use client';

import { FormEvent, MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import data from '@/data';
import useLocalStorage from '@/hooks/use-local-storage';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {
  const [isVisibleInitially, updateSettings] = useLocalStorage<string>('visible', '');
  const [checkState] = useState<string[]>(
    isVisibleInitially === '' ? data.map(v => v.id) : isVisibleInitially.split(',')
  );
  const router = useRouter();

  return (
    <main className={ styles.main }>
      <Header title='Настройки' subtitle={ ['Карточки'] } showSearch={ false } showSettingsButton={ false } />

      <div className={ styles.wrapper }>
        <form onSubmit={ handleSubmit }>
          <p className={ styles.info }></p>
          <div className={ styles.labels }>
            { data.map((v: GroupInfo) => (
              <label key={ v.id } className={ styles.label }>
                <input type='checkbox' name={ v.id } defaultChecked={ checkState.includes(v.id) } className={ styles.checkbox } />
                { v.title }
              </label>
            )) }
          </div>
          <div className={ styles.buttons }>
            <Button label={ 'Показывать выбранное' } type='submit' showLabel={ true } className={ styles.submit } />
            <Button label={ 'Показывать все' } type='reset' showLabel={ true } onClick={ handleReset } />
            <Button label={ 'Закрыть' } showLabel={ true } className={ styles.cancel } onClick={ () => router.back() } />
          </div>
        </form>
      </div>
    </main >
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    updateSettings(Object.keys(formData).join(','));
    router.back();
  }

  function handleReset(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
    e.preventDefault();
    updateSettings('');
    router.back();
  }
}
