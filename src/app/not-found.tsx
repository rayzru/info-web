import Link from 'next/link';

import { Header } from '@/components/Header';
import { InfoGrid } from '@/components/InfoGrid';

import styles from './page.module.scss';

export default function NotFound() {
  return (
    <main className={ styles.main }>
      <Header className={ styles.header } subtitle={ [] } showSearch={ false } showBack={ true } showSettingsButton={ false } />
      <InfoGrid className={ styles.cards }>
        <div>
          <h2>Потрачено</h2>
          <p>Вы зашли в тупиковую ветвь интернета.</p>
          <Link href="/">На главную</Link>
        </div>
      </InfoGrid>
    </main >
  );
}
