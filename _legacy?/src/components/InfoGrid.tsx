import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import styles from './InfoGrid.module.scss';

interface Props extends PropsWithChildren, PropsWithStyles { }

export const InfoGrid = ({ children, className }: Props) => {
  return <section className={ clsx(styles.section, className) }>{ children }</section>;
};