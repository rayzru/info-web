import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import styles from './ParkingGrid.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles { }

export const ParkingGrid = ({ children, className }: Props) => {
  return <section className={ clsx(styles.section, className) }>{ children }</section>;
};
