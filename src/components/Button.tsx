import { ReactEventHandler } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import { Icon, IconType } from './card/Icon';

import styles from './Button.module.scss';

interface Props extends PropsWithStyles {
    icon?: IconType;
    showLabel?: boolean;
    label?: string;
    onClick?: ReactEventHandler<HTMLButtonElement>;
}

export const Button = ({
  icon,
  label,
  className,
  showLabel = false,
  onClick
}: Props) => {
  return (
    <button
      onClick={ onClick }
      title={ label }
      className={
        clsx(
          styles.button,
          label && styles.hasLabel,
          icon && styles.hasIcon,
          className
        )
      }
    >
      { icon && <Icon type={ icon } /> }
      { showLabel && label }
    </button>
  );
};