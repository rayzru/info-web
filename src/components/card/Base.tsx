'use client';

import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

import { Button } from '@/components/Button';
import { IconType } from '@/components/card/Icon';
import { BaseInfo } from '@/types';

import styles from './Base.module.scss';

export interface Action {
  icon?: IconType;
  label?: string;
  href?: string;
  callback?: () => void;
}

interface Props extends BaseInfo, PropsWithChildren {
  actions?: Action[];
}

export const Base = ({
  title,
  subtitle,
  description,
  tags,
  children,
  actions = [],
}: Props) => {
  return (
    <div className={
      clsx(
        styles.component,
        actions.length && styles.hasActions,
        description && styles.hasDescription,
        tags?.length && styles.hasTags,
      )
    }>
      <div className={ styles.content }>
        <div className={ styles.children }>{ children }</div>
        <header className={ styles.header }>
          <h4 className={ styles.title }>{ title } </h4>
          { subtitle && <h5 className={ styles.subtitle }>{ subtitle } </h5> }
        </header>
        { description && <p className={ styles.description }>{ description } </p> }
        { tags && <p className={ styles.tags }>{ }</p> }
      </div>
      { actions && (
        <div className={ styles.actions }>
          { actions.map(({ icon, label, callback, href }: Action, i: number) => <Button href={ href } key={ i } icon={ icon } label={ label } onClick={ callback } />) }
        </div>
      ) }
    </div>
  );
};