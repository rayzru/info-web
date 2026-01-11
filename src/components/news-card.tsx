import Link from "next/link";
import Image from "next/image";
import { Calendar, Megaphone, Wrench, Users, AlertTriangle, Sparkles, Pin } from "lucide-react";

import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { NewsType } from "~/server/db/schema";

// ============================================================================
// Types
// ============================================================================

interface NewsCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  type: NewsType;
  publishAt?: Date | null;
  isPinned?: boolean;
  isHighlighted?: boolean;
  createdAt: Date;
  className?: string;
}

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
// Utility Functions
// ============================================================================

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(d);
}

// ============================================================================
// Components
// ============================================================================

export function NewsCard({
  title,
  slug,
  excerpt,
  coverImage,
  type,
  publishAt,
  isPinned,
  isHighlighted,
  createdAt,
  className,
}: NewsCardProps) {
  const typeConfig = NEWS_TYPE_CONFIG[type];
  const Icon = typeConfig.icon;
  const displayDate = publishAt ?? createdAt;

  return (
    <Link href={`/news/${slug}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg",
          isHighlighted && "ring-2 ring-primary ring-offset-2",
          className
        )}
      >
        {/* Cover Image */}
        {coverImage ? (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized={coverImage.includes("/uploads/")}
            />
            {isPinned && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="gap-1 bg-background/80 backdrop-blur">
                  <Pin className="h-3 w-3" />
                  Закреплено
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[16/9] bg-muted flex items-center justify-center">
            <Icon className="h-12 w-12 text-muted-foreground/30" />
            {isPinned && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="gap-1">
                  <Pin className="h-3 w-3" />
                  Закреплено
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4">
          {/* Type Badge & Date */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge variant="secondary" className={cn("gap-1", typeConfig.color)}>
              <Icon className="h-3 w-3" />
              {typeConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(displayDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// ============================================================================
// List Components
// ============================================================================

interface NewsCardListProps {
  news: NewsCardProps[];
  className?: string;
}

export function NewsCardGrid({ news, className }: NewsCardListProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {news.map((item) => (
        <NewsCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export function NewsCardCompact({
  title,
  slug,
  type,
  publishAt,
  createdAt,
  className,
}: Omit<NewsCardProps, "coverImage" | "excerpt" | "isHighlighted">) {
  const typeConfig = NEWS_TYPE_CONFIG[type];
  const Icon = typeConfig.icon;
  const displayDate = publishAt ?? createdAt;

  return (
    <Link
      href={`/news/${slug}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted",
        className
      )}
    >
      <div className={cn("rounded-lg p-2", typeConfig.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{formatDate(displayDate)}</p>
      </div>
    </Link>
  );
}
