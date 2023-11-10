import { ReactEventHandler } from 'react';
import { clsx } from 'clsx';

import { Icon, IconType } from '@/components/Icon';
import { PropsWithStyles } from '@/types';

import styles from './Button.module.scss';

interface Props extends PropsWithStyles {
  icon?: IconType;
  href?: string;
  showLabel?: boolean;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  label?: string;
  onClick?: ReactEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const Button = ({
  icon,
  label,
  href,
  disabled,
  type = 'button',
  className,
  showLabel = false,
  onClick,
  ...props
}: Props) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      onClick={ onClick }
      disabled={ disabled }
      title={ label }
      type={ type }
      target='_blank'
      href={ href }
      data-tooltip-id="tooltip"
      className={
        clsx(
          styles.button,
          label && showLabel && styles.hasLabel,
          icon && styles.hasIcon,
          disabled && styles.disabled,
          className
        )
      }
      { ...props }
    >
      { icon && <Icon type={ icon } /> }
      { showLabel && label }
    </Component>
  );
};
