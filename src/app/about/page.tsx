'use client';

import { SyntheticEvent, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';

import { ChatCard } from '@/components/ChatCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';

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
            <TabList onChange={ handleChange }  >
              <Tab label="О проекте" value="project" sx={ { padding: 0, minWidth: 0 } } />
              <Tab label="Чаты и ресурсы" value="chats" sx={ { padding: 0, marginLeft: 2, minWidth: 0 } } />
              <Tab label="Правила" value="rules" sx={ { padding: 0, marginLeft: 2, minWidth: 0 } } />
            </TabList>
            <TabPanel value="project" className={ styles.tabPanel }>
              <Box sx={ { position: 'absolute', display: { xs: 'none', md: 'block' }, left: 640 } }>
                <Logo type='root' width={ 240 } />
              </Box>

              <article className={ styles.article }>
                <h3>Сообщество соседей ЖК Сердце Ростова 2</h3>
                <p>Привет! Меня зовут <a href='https://andrew.rumm.im' target='_blank'>Андрей</a> и я выступаю в роли основного инициатора создания сообщества.</p>

                <p>Цель сообщества заключается в создании информационной платформы для жителей, основанной на принципах открытости и доступности всех ее ресурсов. Здесь вы найдете информацию о событиях, мероприятиях, новостях, справочных материалах, опыте соседей и контактной информации. Все эти ресурсы предназначены для обмена информацией и взаимопомощи, чтобы жители могли быть в курсе происходящих событий и оказывать поддержку друг другу.</p>

                <p>История сообщества началась в 2019 году с открытия <a href='https://go.sr2.today/telegram' target='_blank'>основного чата в Telegram</a>, открытый вскоре <a href='https://go.sr2.today/whatsapp' target='_blank'>после группы в WhatsApp</a>. В 2020 году были созданы отдельные чаты для обсуждения событий, происходящих в каждом из зданий нашего ЖК (литерные/строений). Примерно через год-полтора стало понятно, что информацию необходимо систематизировать, и был создан <a href='https://sr2.today' target='_blank'>сайт сообщества</a>. <a href='https://go.sr2.today/vk' target='_blank'>Группа ВК</a> не является популярной, однако с 2022 года там иногда публикуются объявления о происходящих событиях и происшествиях.</p>

                <p>На данный момент самым популярным ресурсом, помимо чатов, является <a href='https://info.sr2.today' target='_blank'>Справочник</a>, собирающий самую востребованную и полезную информацию о жилом комплексе &quot;Сердце Ростова 2&quot;.</p>

                <p>Проект развивается абсолютно бесплатно, собственными силами. Любая помощь в модерировании, информационное сопровождение, конструктивные предложения, а так же <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>материальная помощь</a> приветствуется.</p>

                <p>Ваши предложения и пожелания с благодарностью принимаются как в наших чатах, так и <a href='https://t.me/rayzru' target='_blank'>лично</a>.</p>

                <p>Направленные <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>материальные средства взаимопомощи</a> будут направляться на оплату хостинга, ботов, доменов и на дальнейшее развитие.</p>
              </article>
            </TabPanel>
            <TabPanel value="chats" className={ styles.tabPanel }>
              <section className={ styles.chatsSection }>
                <h3>Основные чаты сообщества соседей</h3>
                <div className={ styles.chats }>
                  <ChatCard url='https://t.me/serdcerostova2' title={ 'Сердце Ростова 2' } subtitle='Главный чат' />
                  <ChatCard url='https://t.me/sr2today' title={ 'Новостной канал' } subtitle={ 'Новости СР2' } />
                  <ChatCard title={ 'Сердце Ростова 2' } url='https://wa.me/serdcerostova2' subtitle='WhatsApp чат сообщества' />
                </div>

                <h3 className={ styles.chatsSectionTitle }>Чаты строений/литеров</h3>
                <div className={ styles.chats }>
                  <ChatCard url='https://t.me/sr2l1' title={ 'Литер 1' } subtitle='Ведется строительство' />
                  <ChatCard url='https://t.me/sr2_l2' title={ 'Литер 2' } subtitle='Строение 2, подъезд 1' />
                  <ChatCard url='https://t.me/sr2_l3' title={ 'Литер 3' } subtitle='Строение 2, подъезд 2' />
                  <ChatCard url='https://t.me/sr2_l4' title={ 'Литер 4' } subtitle='Строение 1, подъезд 1' />
                  <ChatCard url='https://t.me/sr2_l5' title={ 'Литер 5' } subtitle='Строение 1, подъезд 2' />
                  <ChatCard url='https://t.me/sr2_l6' title={ 'Строение 7' } subtitle='Литер 6' />
                  <ChatCard url='https://t.me/sr2_l7' title={ 'Строение 6' } subtitle='Литер 7' />
                  <ChatCard url='https://t.me/sr2l8' title={ 'Литер 8' } subtitle='Ведется строительство' />
                  <ChatCard url='https://t.me/sr2_l9' title={ 'Литер 9' } subtitle='Ведется строительство' />
                </div>

                <h3 className={ styles.chatsSectionTitle }>Другие</h3>
                <div className={ styles.chats }>
                  <ChatCard url='https://t.me/sr2_market' title={ 'Барахолка' } />
                  <ChatCard url='https://t.me/sr2_auto' title={ 'Авто/Парковки' } />
                </div>
              </section>
            </TabPanel>
            <TabPanel value="rules" className={ styles.tabPanel }>
              <article className={ styles.article }>
                <h3>Правила поведения в чатах</h3>
                <p>Основные правила одинаковы для всех чатов в нашем сообществе.
                  Кроме того, в тематических чатах, таких как <b>Барахолка</b>, действуют определенные ограничения.</p>

                <p>Чаты ведут активные жильцы — ваши соседи — на добровольных началах в интересах своих семей и соседей.</p>
                <p>Основной тематикой является объединение и защита интересов по улучшению качества жизни.</p>

                <ul>
                  <li>Пожалуйста, старайтесь придерживаться темы чата и уважать время других участников.</li>
                  <li>Реклама и самореклама на канале строго запрещены. Это означает, что запрещено размещать сообщения, направленные на привлечение целевой аудитории к товарам или услугам. Также запрещено использовать чаты для продвижения собственных финансовых интересов в любой форме. Вместо этого приветствуются рекомендации от жильцов на основе их собственного опыта.</li>
                  <li>Любые формы ругани, матерной лексики, оскорблений, агрессии (как прямой, так и завуалированной) считаются нарушением правил. Пожалуйста, относитесь друг к другу с уважением, так как это является основополагающим принципом для создания здорового сообщества.</li>
                  <li>Запрещено размещать ссылки на внешние ресурсы, за исключением официальных государственных сайтов, регламентных или официальных справочников с юридической информацией или информацией новостного характера, соответствующей основной тематике чатов. Также категорически запрещено размещать ссылки на другие чаты, не относящиеся к группе чатов нашего сообщества.</li>
                  <li>Запрещены политические темы, обсуждение религии, контент для взрослых и темы сексуального характера, а также любые другие темы, которые явно или косвенно нарушают законы РФ. Эти темы будут строго пресекаться.</li>
                </ul>

                <p>Администраторы добровольно следят за соблюдением правил в каждом из чатов. Любые спорные вопросы обсуждаются, и мы поддерживаем цивилизованное общение и конструктивный подход.</p>
              </article>
            </TabPanel>
          </TabContext>
        </section>
      </main >
      <Footer />
    </>
  );
}
