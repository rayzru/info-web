import { db } from '../src/server/db/index.js';
import { news } from '../src/server/db/schema.js';
import { desc } from 'drizzle-orm';

const items = await db.query.news.findMany({
  orderBy: [desc(news.createdAt)],
  limit: 10,
  columns: {
    title: true,
    slug: true,
    isPinned: true,
    publishAt: true,
    createdAt: true,
    status: true,
  },
});

const now = new Date();
console.log('\n📰 Все новости в БД:');
console.log('='.repeat(100));
console.log(`Текущее время: ${now.toISOString()}\n`);

items.forEach((item, i) => {
  const published = item.status === 'published';
  const publishTimeOk = !item.publishAt || item.publishAt <= now;
  const visible = published && publishTimeOk;

  console.log(`${i + 1}. ${item.isPinned ? '📌 ' : '   '}${item.title}`);
  console.log(`   slug: ${item.slug}`);
  console.log(`   status: ${item.status} ${published ? '✅' : '❌'}`);
  console.log(`   publishAt: ${item.publishAt?.toISOString() || 'null'} ${publishTimeOk ? '✅' : '❌ FUTURE'}`);
  console.log(`   createdAt: ${item.createdAt.toISOString()}`);
  console.log(`   ВИДНА НА САЙТЕ: ${visible ? '✅ ДА' : '❌ НЕТ'}`);
  console.log('');
});

process.exit(0);
