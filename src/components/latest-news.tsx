import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

import { Button } from "~/components/ui/button";
import { NewsCardGrid } from "~/components/news-card";
import { api } from "~/trpc/server";

export async function LatestNews() {
  const news = await api.news.latest({ limit: 4 });

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Новости</h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news" className="gap-1">
            Все новости
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* News Grid */}
      <NewsCardGrid
        news={news.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          publishAt: item.publishAt ? new Date(item.publishAt) : null,
        }))}
      />
    </section>
  );
}
