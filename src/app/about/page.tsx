'use client';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import styles from './page.module.scss';

export default function About() {

  return (
    <>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />
        <section className={ styles.pageLayout }>
          <article className={ styles.article }>
            <h3>Сообщество соседей ЖК Сердце Ростова 2</h3>

            <p>Цель сообщества заключается в создании информационной платформы для жителей, основанной на принципах открытости и доступности всех ее ресурсов. Здесь вы найдете информацию о событиях, мероприятиях, новостях, справочных материалах, опыте соседей и контактной информации. Все эти ресурсы предназначены для обмена информацией и взаимопомощи, чтобы жители были в курсе происходящих событий и оказывали поддержку друг другу.</p>

            <p>История сообщества началась в 2019 году с открытия <a href='https://go.sr2.today/telegram' target='_blank'>основного чата в Telegram</a>, открытый вскоре после группы в WhatsApp. В 2020 году были созданы отдельные чаты для обсуждения событий, происходящих в каждом из зданий нашего ЖК (литерные/строений). Примерно через год-полтора стало понятно, что информацию необходимо систематизировать, и был создан <a href='https://sr2.today' target='_blank'>сайт сообщества</a>. <a href='https://go.sr2.today/vk' target='_blank'>Группа ВК</a> не является популярной, однако с 2022 года там иногда публикуются объявления о происходящих событиях и происшествиях.</p>

            <p>На данный момент самым популярным ресурсом, помимо чатов, является <a href='https://info.sr2.today' target='_blank'>Справочник</a>, собирающий самую востребованную и полезную информацию о жилом комплексе &quot;Сердце Ростова 2&quot;.</p>

            <p>Проект развивается абсолютно бесплатно, собственными силами. Любая помощь в модерировании, информационное сопровождение, конструктивные предложения, а так же <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>материальная помощь</a> приветствуется и будет направлена на оплату хостинга, ботов, доменов и на дальнейшее развитие.</p>

            <p>Ваши предложения и пожелания с благодарностью принимаются как в наших чатах, так и <a href='https://t.me/rayzru' target='_blank'>лично</a>.</p>
          </article>
        </section>
      </main >
      <Footer />
    </>
  );
}
