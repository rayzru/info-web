import { Suspense } from "react";
import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";

import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { NewsCardGrid } from "~/components/news-card";
import { NewsFilters } from "./news-filters";
import type { NewsType } from "~/server/db/schema";

export const metadata = {
  title: "Новости | SR2",
  description: "Все новости и объявления ЖК SR2",
};

interface NewsPageProps {
  searchParams: Promise<{
    type?: NewsType;
  }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Новости</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Объявления, мероприятия и важная информация
        </p>
      </div>

      {/* Filters */}
      <NewsFilters currentType={params.type} />

      {/* News List */}
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList type={params.type} />
      </Suspense>
    </div>
  );
}

async function NewsList({ type }: { type?: NewsType }) {
  const { items } = await api.news.list({ limit: 20, type });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Newspaper className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-semibold">Новостей пока нет</h3>
        <p className="text-sm text-muted-foreground">
          {type ? "В этой категории пока нет новостей" : "Скоро здесь появятся новости"}
        </p>
      </div>
    );
  }

  return (
    <NewsCardGrid
      news={items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        publishAt: item.publishAt ? new Date(item.publishAt) : null,
      }))}
      className="lg:grid-cols-3"
    />
  );
}

function NewsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
            <div className="h-5 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
