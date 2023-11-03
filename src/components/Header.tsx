import { clsx } from 'clsx';
import Link from 'next/link'

import { PropsWithStyles } from '@/types';

import { Logo } from './Logo';
import Search from './Search';
import Settings from './Settings';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
  title?: string;
  subtitle?: string[];
  showSettingsButton?: boolean;
  showSearch?: boolean;
}

export const Header = ({
  className,
  title = 'Справочная',
  subtitle = [],
  showSearch = true,
  showSettingsButton = true,
}: Props) => {
  return (
    <header className={ clsx(styles.header, className) }>
      <h1 className={ clsx(subtitle && styles.hasSubtitle) }>{ title }</h1>
      { subtitle.map((s: string, i: number) => (<h2 key={ `subtitle-${i}` }>{ s }</h2>)) }
      { showSearch && <Search className={ styles.search } /> }
      { showSettingsButton && (
        <Link href="/settings">
          <Settings className={ styles.settings } />
        </Link>
      ) }
    </header>
  );
};
