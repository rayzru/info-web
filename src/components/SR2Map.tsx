'use client';

import { useRef, useState } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import styles from './SR2Map.module.scss';

type ModeType = 'ground' | 'parking'

interface Props extends PropsWithStyles { }

const defaultViewBox = '0 0 4000 3300';

export const SR2Map = ({ className }: Props) => {
  const zoomRef = useRef<SVGGElement>(null);
  const [zoom] = useState(1);
  const [viewBox] = useState(defaultViewBox);
  const [mode, setMode] = useState<ModeType>('ground');

  return (
    <div className={ clsx(styles.mapWrapper, className) }>
      <svg viewBox={ viewBox } className={ styles.map } xmlns="http://www.w3.org/2000/svg">

        <g ref={ zoomRef } scale={ zoom }>

          { mode === 'parking' && (
            <use className={ clsx(styles.str, styles.disabled) } href='/svg/plan/kg.svg#kg' x={ 1940 } y={ 1420 } />
          ) }

          { mode === 'ground' && (
            <>
              <use className={ styles.ground } href="/svg/plan/ground.svg#ground" />

              <use className={ clsx(styles.str, styles.disabled) } href='/svg/plan/kg.svg#kg' x={ 1940 } y={ 1420 } />

              <use className={ clsx(styles.str, styles.disabled) } href='/svg/plan/str-5.svg#str-5' x={ 2845 } y={ 155 } />
              <use className={ clsx(styles.liter, styles.disabled) } href='/svg/plan/liter-b-back.svg#liter-b-back' x={ 2930 } y={ 130 } />
              <use className={ clsx(styles.liter, styles.disabled) } href='/svg/plan/liter-b-front.svg#liter-b-front' x={ 2925 } y={ 550 } />

              <use className={ styles.str } href='/svg/plan/str-6.svg#str-6' x={ 2080 } y={ 300 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-b-back.svg#liter-b-back' x={ 2160 } y={ 355 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-b-front.svg#liter-b-front' x={ 2155 } y={ 775 } />

              <use className={ clsx(styles.str) } href='/svg/plan/str-7.svg#str-7' x={ 1250 } y={ 690 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-b-back.svg#liter-b-back' x={ 1380 } y={ 675 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-b-mid.svg#liter-b-mid' x={ 1371 } y={ 1095 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-b-front.svg#liter-b-front' x={ 1365 } y={ 1475 } />

              <use className={ clsx(styles.str, styles.disabled) } href='/svg/plan/str-8.svg#str-8' x={ 610 } y={ 995 } />
              <use className={ clsx(styles.str, styles.disabled) } href='/svg/plan/str-9.svg#str-9' x={ 140 } y={ 1620 } />

              <use className={ styles.str } href='/svg/plan/str-1.svg#str-1' x={ 2110 } y={ 1550 } />
              <use className={ styles.str } href='/svg/plan/str-2.svg#str-2' x={ 845 } y={ 2025 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-a.svg#liter-a' x={ 915 } y={ 2565 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-a.svg#liter-a' x={ 1580 } y={ 2260 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-a.svg#liter-a' x={ 2240 } y={ 1950 } />
              <use className={ clsx(styles.liter) } href='/svg/plan/liter-a.svg#liter-a' x={ 2900 } y={ 1645 } />
            </>
          ) }
        </g>
      </svg>
    </div>
  );
};
