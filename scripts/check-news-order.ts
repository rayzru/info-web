import { db } from '../src/server/db/index.js';
import { news } from '../src/server/db/schema.js';
import { desc, eq, or, lte, sql, and } from 'drizzle-orm';

const now = new Date();
const items = await db.query.news.findMany({
  where: and(
    eq(news.status, 'published'),
    or(lte(news.publishAt, now), sql`${news.publishAt} IS NULL`)
  ),
  orderBy: [desc(news.isPinned), desc(news.publishAt), desc(news.createdAt)],
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

console.log('\n📰 Новости на главной (текущая сортировка):');
console.log('='.repeat(80));
items.forEach((item, i) => {
  console.log(`${i + 1}. ${item.isPinned ? '📌 ' : '   '}${item.title}`);
  console.log(`   slug: ${item.slug}`);
  console.log(`   publishAt: ${item.publishAt?.toISOString() || 'null'}`);
  console.log(`   createdAt: ${item.createdAt.toISOString()}`);
  console.log('');
});

process.exit(0);
