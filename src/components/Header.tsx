import { clsx } from 'clsx';
import Link from 'next/link';

import { PropsWithStyles } from '@/types';

import { Logo } from './Logo';
import Search from './Search';
import Settings from './Settings';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
    title?: string;
    subtitle?: string[];
    href?: string;
}

export const Header = ({
  className,
  title = 'Справочная',
  subtitle = [],
  href = '/'
}: Props) => {
  return (
    <header className={ clsx(styles.header, className) }>
      <Link href={ href }>
        <Logo type='root' className={ styles.logo } />
      </Link>
      <h1 className={ clsx(subtitle && styles.hasSubtitle) }>{ title }</h1>
      { subtitle.map((s: string, i: number) => (<h2 key={ `subtitle-${i}` }>{ s }</h2>)) }
      <Search className={ styles.search } />
      <Settings className={ styles.settings } />
    </header>
  );
};
