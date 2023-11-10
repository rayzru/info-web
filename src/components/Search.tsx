'use client';

import { useRef } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import styles from './Search.module.scss';

interface Props extends PropsWithStyles { }

const Search = ({ className }: Props) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={ clsx(styles.component, className) }>
      <input
        placeholder='Поиск...'
        className={ styles.searchInput }
        type="search"
        ref={ searchInputRef }
      />
    </div>
  );
};

export default Search;
