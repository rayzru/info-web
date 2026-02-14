import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NewsCardGrid } from "~/components/news-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Новости</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" asChild>
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
              className="bg-card group block overflow-hidden rounded-lg border transition-shadow hover:shadow-sm"
            >
              <div className="flex gap-3 p-3">
                {item.coverImage && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={item.coverImage.includes("/uploads/")}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="group-hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="text-muted-foreground h-5 w-5" />
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
