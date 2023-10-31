import { Card } from '@/components/Card';
import { InfoGrid } from '@/components/InfoGrid';
import data from '@/data';
import { GroupInfo } from '@/types';

import styles from './page.module.scss';

export default function Home() {

  return (
    <main className={ styles.main }>
      {/* <Header subtitle={ [] } /> */ }
      <InfoGrid className={ styles.cards }>
        { data.map((el: GroupInfo) => <Card key={ el.id } info={ el } />) }
        <div className={ styles.support }>
          <div>Не хватает информации или нашли ошибку?</div>
          <div>Напишите мне в <a target='_blank' href='https://t.me/rayzru' className={ styles.link }>Telegram</a></div>
        </div>
      </InfoGrid>
      {/* <Map className={ styles.map } /> */ }
    </main >
  );
}
//https://t.me/rayzru?text="Сообщение по поводу справочника Сердца Ростова 2"
