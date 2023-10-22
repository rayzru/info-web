'use client';

import { PropsWithChildren } from 'react';
import { BaseInfo } from '@/types';
import { Icon, IconType } from '@/components/card/Icon';

import styles from './Base.module.scss';
import { Button } from '../Button';
import { clsx } from 'clsx';

export interface Action {
    icon?: IconType;
    label?: string;
    callback?: () => void;
}

interface Props extends BaseInfo, PropsWithChildren {
    icon: IconType;
    actions?: Action[];
}

export const Base = ({
    icon,
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
            <Icon type={ icon } className={ styles.icon } />
            <div className={ styles.content }>
                <header>
                    <h5 className={ styles.title }>{ title } </h5>
                    { subtitle && <h6 className={ styles.subtitle }>{ subtitle } </h6> }
                </header>
                { description && <p className={ styles.description }>{ description } </p> }
                <div className={ styles.children }>{ children }</div>
                { tags && <p className={ styles.tags }>{ }</p> }
            </div>
            { actions && (
                <div className={ styles.actions }>
                    { actions.map(({ icon, label, callback }: Action, i: number) => <Button key={ i } icon={ icon } label={ label } onClick={ callback } />) }
                </div>
            ) }
        </div>
    );
};