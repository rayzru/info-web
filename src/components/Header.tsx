import { clsx } from 'clsx';
import Link from 'next/link'

import { PropsWithStyles } from '@/types';

import { Button } from './Button';
import { Logo, LogoType } from './Logo';
import Search from './Search';
import Settings from './Settings';

import styles from './Header.module.scss';

interface Props extends PropsWithStyles {
  title?: string;
  subtitle?: string[];
  logo?: LogoType;
  showSettingsButton?: boolean;
  showSearch?: boolean;
  showBack?: boolean;
}

export const Header = ({
  className,
  title = 'Справочная',
  subtitle = [],
  logo = 'root',
  showSearch = true,
  showSettingsButton = true,
  showBack = false,

}: Props) => {
  return (
    <header className={ clsx(styles.header, className) }>
      { logo && <Logo type={ logo } className={ styles.logo } /> }
      <div className={ styles.titles }>
        <h1 className={ clsx(subtitle && styles.hasSubtitle) }>{ title }</h1>
        { subtitle.map((s: string, i: number) => (<h2 key={ `subtitle-${i}` }>{ s }</h2>)) }
      </div>
      { showSearch && <Search className={ styles.search } /> }
      { showSettingsButton && (
        <Link href="/settings">
          <Settings className={ styles.settings } />
        </Link>
      ) }
      { showBack && (
        <Link href="/">
          <Button icon={ 'arrow-up' } label={ 'Назад' } showLabel={ true } />
        </Link>
      ) }
    </header>
  );
};
