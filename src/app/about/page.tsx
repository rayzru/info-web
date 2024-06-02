'use client';

import { Box, Grid } from '@mui/material';

import { ChatCard } from '@/components/ChatCard';

export default function About() {
  return (
    <Grid container spacing={ 4 }>
      <Grid item xs={ 12 } md={ 6 }>
        <h1>Сообщество соседей</h1>
        <p>Цель сообщества заключается в создании информационной платформы для жителей, основанной на принципах открытости и доступности всех ее ресурсов. Здесь вы найдете информацию о событиях, мероприятиях, новостях, справочных материалах, опыте соседей и контактной информации. Все эти ресурсы предназначены для обмена информацией и взаимопомощи, чтобы жители были в курсе происходящих событий и оказывали поддержку друг другу.</p>

        <p>История сообщества началась в конце 2018, в начале 2019 года с открытия <a href='https://go.sr2.today/telegram' target='_blank'>основного чата в Telegram</a>, открытый вскоре <a href='https://go.sr2.today/whatsapp' target='_blank'>после группы в WhatsApp</a>. В 2020 году были созданы отдельные чаты для обсуждения событий, происходящих в каждом из зданий нашего ЖК (литерные/строений). Примерно через год-полтора стало понятно, что информацию необходимо систематизировать, и был создан <a href='https://sr2.today' target='_blank'>сайт сообщества</a>. <a href='https://go.sr2.today/vk' target='_blank'>Группа ВК</a> не является популярной, однако с 2022 года там иногда публикуются объявления о происходящих событиях и происшествиях.</p>

        <p>На данный момент самым популярным ресурсом, помимо чатов, является <a href='/' target='_blank'>Справочник</a>, собирающий самую востребованную и полезную информацию о жилом комплексе &quot;Сердце Ростова 2&quot;.</p>

        <p>Проект развивается абсолютно бесплатно, собственными силами. Любая помощь в модерировании, информационное сопровождение, конструктивные предложения, а так же <a href='https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/'>материальная помощь</a> приветствуется и будет направлена на оплату хостинга, ботов, доменов и на дальнейшее развитие.</p>

        <p>Ваши предложения и пожелания с благодарностью принимаются как в наших чатах, так и <a href='https://t.me/rayzru' target='_blank'>лично</a>.</p>
      </Grid>
      <Grid item xs={ 12 } md={ 6 }>
        <h2>Основные чаты сообщества</h2>
        <Box sx={ { display: 'flex', flexFlow: 'row wrap', gap: 2 } }>
          <ChatCard url='https://t.me/serdcerostova2' title={ 'Сердце Ростова 2' } subtitle='Главный чат' />
          <ChatCard url='https://t.me/sr2today' title={ 'Новостной канал' } subtitle={ 'Новости СР2' } />
          <ChatCard title={ 'Сердце Ростова 2' } url='https://wa.me/serdcerostova2' subtitle='WhatsApp чат сообщества' />
        </Box>

        <h2>Чаты строений/литеров</h2>
        <Box sx={ { display: 'flex', flexFlow: 'row wrap', gap: 2 } }>
          <ChatCard url='https://t.me/sr2_s1' title={ 'Строение 1' } subtitle='Литер 4, 5' />
          <ChatCard url='https://t.me/sr2_s2' title={ 'Строение 2' } subtitle='Литер 2, 3' />
          <ChatCard url='https://t.me/sr2_s6' title={ 'Строение 6' } subtitle='Литер 7' />
          <ChatCard url='https://t.me/sr2_s7' title={ 'Строение 7' } subtitle='Литер 6' />

          <ChatCard url='https://t.me/sr2l1' title={ 'Литер 1' } subtitle='Ведется строительство' />
          <ChatCard url='https://t.me/sr2l8' title={ 'Литер 8' } subtitle='Ведется строительство' />
          <ChatCard url='https://t.me/sr2_l9' title={ 'Литер 9' } subtitle='Ведется строительство' />
        </Box>


        <h2 >Другие</h2>
        <Box sx={ { display: 'flex', flexFlow: 'row wrap', gap: 2 } }>
          <ChatCard url='https://t.me/sr2_market' title={ 'Барахолка' } />
          <ChatCard url='https://t.me/sr2_auto' title={ 'Авто/Парковки' } />
        </Box>
      </Grid>
    </Grid>
  );
}
