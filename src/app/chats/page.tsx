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
        <section className={ styles.section }>
          <h2>Основные чаты сообщества</h2>
          <div className={ styles.chats }>
            <ChatCard url='https://t.me/serdcerostova2' title={ 'Сердце Ростова 2' } subtitle='Главный чат' />
            <ChatCard url='https://t.me/sr2today' title={ 'Новостной канал' } subtitle={ 'Новости СР2' } />
            <ChatCard title={ 'Сердце Ростова 2' } url='https://wa.me/serdcerostova2' subtitle='WhatsApp чат сообщества' />
          </div>

          <h2 className={ styles.chatsSectionTitle }>Чаты строений/литеров</h2>
          <div className={ styles.chats }>
            <ChatCard url='https://t.me/sr2_s1' title={ 'Строение 1' } subtitle='Литер 4, 5' />
            <ChatCard url='https://t.me/sr2_s2' title={ 'Строение 2' } subtitle='Литер 2, 3' />
            <ChatCard url='https://t.me/sr2_s6' title={ 'Строение 6' } subtitle='Литер 7' />
            <ChatCard url='https://t.me/sr2_s7' title={ 'Строение 7' } subtitle='Литер 6' />
            <ChatCard url='https://t.me/sr2l1' title={ 'Литер 1' } subtitle='Ведется строительство' />
            <ChatCard url='https://t.me/sr2l8' title={ 'Литер 8' } subtitle='Ведется строительство' />
            <ChatCard url='https://t.me/sr2_l9' title={ 'Литер 9' } subtitle='Ведется строительство' />
          </div>

          <h2 className={ styles.chatsSectionTitle }>Другие</h2>
          <div className={ styles.chats }>
            <ChatCard url='https://t.me/sr2_market' title={ 'Барахолка' } />
            <ChatCard url='https://t.me/sr2_auto' title={ 'Авто/Парковки' } />
          </div>
        </section>
      </main >
      <Footer />
    </>
  );
}
