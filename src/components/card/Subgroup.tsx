import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import { Icon, IconType } from './Icon';

import styles from './Subgroup.module.scss';
interface Props extends PropsWithChildren, PropsWithStyles {
  icon: IconType;
}

export const Subgroup = ({ children, className, icon }: Props) => {
  return (
    <section className={ clsx(styles.container, className) }>
      <div className={ styles.icon }>{ icon && <Icon type={ icon } /> }</div>
      <div className={ styles.content }>{ children }</div>
    </section>
  );
};