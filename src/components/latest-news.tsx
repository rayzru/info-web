import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";

import { Button } from "~/components/ui/button";
import { NewsCardGrid } from "~/components/news-card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import { cn } from "~/lib/utils";

interface LatestNewsProps {
  variant?: "grid" | "column";
}

export async function LatestNews({ variant = "grid" }: LatestNewsProps) {
  const news = await api.news.latest({ limit: 4 });

  if (news.length === 0) {
    return null;
  }

  if (variant === "column") {
    return (
      <section>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Новости</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" asChild>
            <Link href="/news" className="gap-1">
              Все
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* News List */}
        <div className="space-y-3">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group block rounded-lg border bg-card hover:shadow-sm transition-shadow overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {item.coverImage && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={item.coverImage.startsWith("/uploads/")}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeDate(new Date(item.createdAt))}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
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

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Сегодня";
  } else if (diffDays === 1) {
    return "Вчера";
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`;
  } else {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(date);
  }
}
