'use client';

import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import { Button } from './Button';

import styles from './Settings.module.scss';

interface Props extends PropsWithStyles {
  onSettings?: () => void;
}

const Settings = ({ className }: Props) => {
  return (
    <div className={ clsx(styles.component, className) }>
      <Button label='Настройки' disabled={ false } showLabel={ true } />
    </div>
  );
};

export default Settings;
