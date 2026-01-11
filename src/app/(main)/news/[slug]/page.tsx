import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Megaphone,
  Sparkles,
  User,
  Users,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichRenderer } from "~/components/editor/renderer/rich-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { NewsType } from "~/server/db/schema";
import { api } from "~/trpc/server";

// ============================================================================
// Constants
// ============================================================================

const NEWS_TYPE_CONFIG: Record<
  NewsType,
  { label: string; icon: typeof Megaphone; color: string }
> = {
  announcement: {
    label: "Объявление",
    icon: Megaphone,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  event: {
    label: "Мероприятие",
    icon: Calendar,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  maintenance: {
    label: "Тех. работы",
    icon: Wrench,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  update: {
    label: "Обновление",
    icon: Sparkles,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  community: {
    label: "Сообщество",
    icon: Users,
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  urgent: {
    label: "Срочное",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

// ============================================================================
// Metadata
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const news = await api.news.bySlug({ slug });
    const publishDate = news.publishAt ?? news.createdAt;

    return {
      title: news.title,
      description: news.excerpt ?? `Новость: ${news.title}`,
      authors: news.author?.name ? [{ name: news.author.name }] : undefined,
      openGraph: {
        type: "article",
        title: news.title,
        description: news.excerpt ?? `Новость: ${news.title}`,
        images: news.coverImage ? [{
          url: news.coverImage,
          width: 1200,
          height: 630,
          alt: news.title,
        }] : undefined,
        publishedTime: publishDate.toISOString(),
        modifiedTime: news.updatedAt?.toISOString(),
        authors: news.author?.name ? [news.author.name] : undefined,
        section: "Новости",
        tags: [NEWS_TYPE_CONFIG[news.type].label],
      },
      twitter: {
        card: news.coverImage ? "summary_large_image" : "summary",
        title: news.title,
        description: news.excerpt ?? `Новость: ${news.title}`,
        images: news.coverImage ? [news.coverImage] : undefined,
      },
      alternates: {
        canonical: `/news/${slug}`,
      },
    };
  } catch {
    return {
      title: "Новость не найдена",
    };
  }
}

// ============================================================================
// Page
// ============================================================================

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let news;
  try {
    news = await api.news.bySlug({ slug });
  } catch {
    notFound();
  }

  const typeConfig = NEWS_TYPE_CONFIG[news.type];
  const Icon = typeConfig.icon;
  const displayDate = news.publishAt ?? news.createdAt;

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/news" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Все новости
        </Link>
      </Button>

      <article className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          {/* Type Badge */}
          <Badge variant="secondary" className={cn("gap-1 mb-4", typeConfig.color)}>
            <Icon className="h-3 w-3" />
            {typeConfig.label}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Author */}
            {news.author ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={news.author.image ?? undefined} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span>{news.author.name ?? "Автор"}</span>
              </div>
            ) : (
              <span>Редакция</span>
            )}

            <span className="text-muted-foreground/50">•</span>

            {/* Date */}
            <time dateTime={displayDate.toISOString()}>
              {formatFullDate(displayDate)}
            </time>
          </div>
        </header>

        {/* Cover Image */}
        {news.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {news.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {news.excerpt}
          </p>
        )}

        {/* Content */}
        <RichRenderer content={news.content} className="prose-lg" />
      </article>
    </div>
  );
}

// ============================================================================
// Utilities
// ============================================================================

function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
