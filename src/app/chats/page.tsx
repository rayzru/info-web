'use client';

import { ChatCard } from '@/components/ChatCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import styles from './page.module.scss';

export default function Chats() {


  return (
    <>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />

        <section className={ styles.pageLayout }>

          <section className={ styles.chatsSection }>
            <h2>Основные</h2>
            <p></p>
            <div className={ styles.chats }>
              <ChatCard
                title={ 'Сердце Ростова 2' }
                url='https://t.me/serdcerostova2'
                subtitle='Telegram'
              />
              <ChatCard
                title={ 'Сердце Ростова 2' }
                url='https://wa.me/serdcerostova2'
                subtitle='WhatsApp'
              />
            </div>

            <h2>Литерные</h2>
            <p></p>
            <div className={ styles.chats }>
              <ChatCard
                title={ 'Литер 1' }
                url='https://t.me/sr2l1'
              />
              <ChatCard
                title={ 'Литер 2' }
                url='https://t.me/sr2_l2'
                subtitle='Строение 2, подъезд 1'
              />
              <ChatCard
                title={ 'Литер 3' }
                url='https://t.me/sr2_l3'
                subtitle='Строение 2, подъезд 2'
              />
              <ChatCard
                title={ 'Литер 4' }
                url='https://t.me/sr2_l4'
                subtitle='Строение 1, подъезд 1'
              />
              <ChatCard
                title={ 'Литер 5' }
                url='https://t.me/sr2_l5'
                subtitle='Строение 1, подъезд 2'
              />
            </div>

            <h2>Второстепенные</h2>
            <p></p>
            <div>
              Чаты
            </div>

            <h2>Другие</h2>
            <p></p>
            <div>
              Чаты
            </div>
          </section>

          <section className={ styles.infoSection }>
            <h2>Информация</h2>
            <p></p>

            <h2>Правила</h2>
            <p></p>
          </section>

        </section>

      </main >
      <Footer />
    </>
  );
}
