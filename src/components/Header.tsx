import { clsx } from 'clsx';
import Link from 'next/link';

import { PropsWithStyles } from '@/types';

import LogoInfo from './LogoInfo';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
    title?: string;
    subtitle?: string[];
    href?: string;
}

export const Header = ({
  className,
  title = 'Информация',
  subtitle = [],
  href = '/'
}: Props) => {
  return (
    <header className={ clsx(styles.header, className) }>
      <Link href={ href }>
        <LogoInfo className={ styles.logo } size={ 24 } />
      </Link>
      <h1 className={ clsx(subtitle && styles.hasSubtitle) }>{ title }</h1>
      { subtitle.map((s: string, i: number) => (<h2 key={ `subtitle-${i}` }>{ s }</h2>)) }

    </header>
  );
};