import { Card } from '@/components/card/Card';
import { Header } from '@/components/Header';
import { InfoGrid } from '@/components/InfoGrid';
import data from '@/data';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {

  return (
    <main className={ styles.main }>
      <Header subtitle={ ['Ларина, 45', 'ЖК "Сердце Ростова 2"'] } />
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo) => <Card key={ el.id } info={ el } />) }
      </InfoGrid>
      {/* <Map className={ styles.map } /> */ }
    </main >
  );
}
