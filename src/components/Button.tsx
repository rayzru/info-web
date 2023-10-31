import { ReactEventHandler } from 'react';
import { clsx } from 'clsx';

import { PropsWithStyles } from '@/types';

import { Icon, IconType } from './Icon';

import styles from './Button.module.scss';

interface Props extends PropsWithStyles {
  icon?: IconType;
  href?: string;
  showLabel?: boolean;
  disabled?: boolean;
  label?: string;
  onClick?: ReactEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const Button = ({
  icon,
  label,
  href,
  disabled,
  className,
  showLabel = false,
  onClick
}: Props) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      onClick={ onClick }
      disabled={ disabled }
      title={ label }
      target='_blank'
      href={ href }
      className={
        clsx(
          styles.button,
          label && showLabel && styles.hasLabel,
          icon && styles.hasIcon,
          disabled && styles.disabled,
          className
        )
      }
    >
      { icon && <Icon type={ icon } /> }
      { showLabel && label }
    </Component>
  );
};
