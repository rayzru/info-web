'use client';

import { SyntheticEvent, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';

import { ChatCard } from '@/components/ChatCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import styles from './page.module.scss';

export default function About() {
  const [value, setValue] = useState('project');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <main className={ styles.main }>
        <Header className={ styles.header } showSearch={ false } showSettingsButton={ false } />
        <section className={ styles.pageLayout }>
          <TabContext value={ value }>
            <TabList onChange={ handleChange } >
              <Tab label="Проект сообщества" value="project" />
              <Tab label="Наши чаты и ресурсы" value="chats" />
              <Tab label="Правила" value="rules" />
            </TabList>
            <TabPanel value="project">

              <article className={ styles.article }>
                <h2>Сообщество соседей ЖК Сердце Ростова 2</h2>
                <p>Привет! Меня зовут <a href='https://andrew.rumm.im' target='_blank'>Андрей</a> и я выступаю в роли основного инициатора создания сообщества.</p>

                <p>Цель сообщества заключается в создании информационной платформы для жителей, основанной на принципах открытости и доступности всех ее ресурсов. Здесь вы найдете информацию о событиях, мероприятиях, новостях, справочных материалах, опыте соседей и контактной информации. Все эти ресурсы предназначены для обмена информацией и взаимопомощи, чтобы жители могли быть в курсе происходящих событий и оказывать поддержку друг другу.</p>

                <p>История сообщества началась в 2019 году с открытия <a href='https://go.sr2.today/telegram' target='_blank'>основного чата в Telegram</a>, открытый вскоре <a href='https://go.sr2.today/whatsapp' target='_blank'>после группы в WhatsApp</a>. В 2020 году были созданы отдельные чаты для обсуждения событий, происходящих в каждом из зданий нашего ЖК (литерные/строений). Примерно через год-полтора стало понятно, что информацию необходимо систематизировать, и был создан <a href='https://sr2.today' target='_blank'>сайт сообщества</a>. <a href='https://go.sr2.today/vk' target='_blank'>Группа ВК</a> не является популярной, однако с 2022 года там иногда публикуются объявления о происходящих событиях и происшествиях.</p>

                <p>На данный момент самым популярным ресурсом, помимо чатов, является <a href='https://info.sr2.today' target='_blank'>Справочник</a>, собирающий самую востребованную и полезную информацию о жилом комплексе "Сердце Ростова 2".</p>

                <p>Проект развивается абсолютно бесплатно, собственными силами. Любая помощь в модерировании, информационном сопровождении, и конструктивные предложения приветствуется.</p>

                <p>Ваши предложения и пожелания с благодарностью принимаются как в наших чатах, так и <a href='https://t.me/rayzru' target='_blank'>лично</a>.</p>

                <p>Направленные <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>материальные средства взаимопомощи</a> будут направляться на оплату хостинга, ботов, доменов и на дальнейшее развитие.</p>
              </article>
            </TabPanel>
            <TabPanel value="chats" className={ styles.chatsTab }>
              <section className={ styles.chatsSection }>
                <h2>Главные общие чаты</h2>
                <p>Общие чаты сообщества соседей</p>
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

                <h2>Чаты литеров/строений</h2>
                <p>Локальные чаты для обсуждения вопросов, относящихся непосредственно к строению/литеру.
                  Для обсуждения повседневных вопросов между соседями.</p>
                <div className={ styles.chats }>
                  <ChatCard url='https://t.me/sr2l1' title={ 'Литер 1' } subtitle='Ведется строительство' />
                  <ChatCard url='https://t.me/sr2_l2' title={ 'Литер 2' } subtitle='Строение 2, подъезд 1' />
                  <ChatCard
                    url='https://t.me/sr2_l3'
                    title={ 'Литер 3' }
                    subtitle='Строение 2, подъезд 2'
                  />
                  <ChatCard
                    url='https://t.me/sr2_l4'
                    title={ 'Литер 4' }
                    subtitle='Строение 1, подъезд 1'
                  />
                  <ChatCard
                    url='https://t.me/sr2_l5'
                    title={ 'Литер 5' }
                    subtitle='Строение 1, подъезд 2'
                  />
                  <ChatCard
                    url='https://t.me/sr2_l6'
                    title={ 'Строение 7' }
                    subtitle='Литер 6'
                  />
                  <ChatCard
                    url='https://t.me/sr2_l7'
                    title={ 'Строение 6' }
                    subtitle='Литер 7'
                  />
                  <ChatCard
                    url='https://t.me/sr2l8'
                    title={ 'Литер 8' }
                    subtitle='Ведется строительство'
                  />
                  <ChatCard
                    url='https://t.me/sr2_l9'
                    title={ 'Литер 9' }
                    subtitle='Ведется строительство'
                  />
                </div>

                <h2>Другие</h2>
                <div className={ styles.chats }>
                  <ChatCard
                    url='https://t.me/sr2today'
                    title={ 'Новостной канал' }
                    subtitle={ 'Новости СР2' }
                  />
                  <ChatCard
                    url='https://t.me/sr2_market'
                    title={ 'Барахолка' }
                  />
                  <ChatCard
                    url='https://t.me/sr2_auto'
                    title={ 'Авто/Парковки' }
                  />
                </div>
              </section>
            </TabPanel>
            <TabPanel value="rules">
              <h2>Правила</h2>
              <p>Основные правила едины в каждом чате.</p>
              <p>Чаты ведут активные жильцы — ваши соседи — на добровольных началах в интересах своих семей и соседей.</p>
              <p>Основной тематикой является объединение и защита интересов по улучшению качества жизни.</p>

              <ul>
                <li>Реклама и самореклама на канале категорически запрещена! Иными словами запрещены сообщения цель которых - привлечение целевой аудитории к товарам или услугам. Запрещено использовать чаты в качестве площадки для развития собственных финансовых интересов в любой форме. В качестве альтернативы разрешены рекомендации от жильцов на основе собственного опыта.</li>
                <li>Запрещены любые ссылки на внешние ресурсы, кроме официальных государственных сайтов, регламентных или официальных справочников с юридической информацией или информацией новостного характера, которая попадает в контекст основной тематики чатов. Категорически запрещены ссылки на другие чаты, не относящиеся к группе чатов нашего сообщетсва.</li>
                <li>Ругань, мат, оскорбления, как прямые и завуалированные, а так же любое проявление прямой или пассивной агрессии является нарушением правил. Относитесь друг к другу с уважением, что является основополагающим ключом к созданию здорового сообщества.</li>
                <li>Политические темы, темы связанные с религией, 18+ контент и темы сексуального характера, и иные темы которые явно или косвенно нарушают законы РФ категорически запрещены и будут пресекаться.</li>
                <li>Сохраняйте, пожалуйста, тематику чата</li>
              </ul>

              <p>За соблюдением правил в каждом из чатов следят администраторы, на добровольных основах.</p>
              <p>Любые спорные вопросы обсуждаемы. Мы за цивилизованное общество и конструктивный подход.</p>
            </TabPanel>
          </TabContext>
        </section>
      </main >
      <Footer />
    </>
  );
}
