import { Header } from '@/components/Header';
import { Map } from '@/components/SR2Map';
import { InfoGrid } from '@/components/InfoGrid';

import data from '@/data';

import { GroupInfo } from '@/types';
import { Card } from '@/components/card/Card';
import styles from './page.module.scss';

export default function Home() {

  return (
    <main className={ styles.main }>
      <Header subtitle={ ['Ларина, 45', 'ЖК "Сердце Ростова 2"'] } />
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo, i: number) => <Card key={ el.id } info={ el } />) }
      </InfoGrid>
      <Map className={ styles.map } />
    </main >
  );
}
