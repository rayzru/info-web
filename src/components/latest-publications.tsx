import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageSquare,
  Megaphone,
  HelpCircle,
  Search,
  ThumbsUp,
  MessagesSquare,
  User,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/server";
import { cn } from "~/lib/utils";
import type { PublicationType } from "~/server/db/schema";

// ============================================================================
// Constants
// ============================================================================

const PUBLICATION_TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof Megaphone; color: string }
> = {
  help_request: {
    label: "Помощь",
    icon: HelpCircle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  lost_found: {
    label: "Потеряно/найдено",
    icon: Search,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  recommendation: {
    label: "Рекомендация",
    icon: ThumbsUp,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  question: {
    label: "Вопрос",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  discussion: {
    label: "Обсуждение",
    icon: MessagesSquare,
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  // Legacy types for backward compatibility
  announcement: {
    label: "Объявление",
    icon: Megaphone,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
};

// ============================================================================
// Component
// ============================================================================

interface LatestPublicationsProps {
  variant?: "grid" | "column";
}

export async function LatestPublications({ variant = "grid" }: LatestPublicationsProps) {
  const publications = await api.publications.latest({ limit: 4 });

  if (publications.length === 0) {
    return null;
  }

  if (variant === "column") {
    return (
      <section>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Публикации</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" asChild>
            <Link href="/publications" className="gap-1">
              Все
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* Publications List */}
        <div className="space-y-3">
          {publications.map((pub) => {
            const typeConfig =
              PUBLICATION_TYPE_CONFIG[pub.type] ?? PUBLICATION_TYPE_CONFIG.discussion!;
            const Icon = typeConfig!.icon;

            return (
              <Link
                key={pub.id}
                href={`/publications/${pub.id}`}
                className="group block rounded-lg border bg-card hover:shadow-sm transition-shadow overflow-hidden"
              >
                <div className="p-3">
                  {/* Type Badge */}
                  <Badge
                    variant="secondary"
                    className={cn("gap-1 mb-2 text-[10px] px-1.5 py-0", typeConfig.color)}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    {typeConfig.label}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>

                  {/* Author & Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    {pub.author && !pub.isAnonymous ? (
                      <>
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={pub.author.image ?? undefined} />
                          <AvatarFallback className="text-[8px]">
                            <User className="h-2 w-2" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[80px]">
                          {pub.author.name}
                        </span>
                        <span>•</span>
                      </>
                    ) : null}
                    <time dateTime={pub.createdAt.toISOString()}>
                      {formatRelativeDate(pub.createdAt)}
                    </time>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Публикации</h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/publications" className="gap-1">
            Все публикации
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Publications Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {publications.map((pub) => {
          const typeConfig =
            PUBLICATION_TYPE_CONFIG[pub.type] ?? PUBLICATION_TYPE_CONFIG.discussion!;
          const Icon = typeConfig!.icon;

          return (
            <Card
              key={pub.id}
              className="group overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Cover Image */}
              {pub.coverImage ? (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={pub.coverImage}
                    alt={pub.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized={pub.coverImage.includes("/uploads/")}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Icon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}

              <CardContent className="p-4">
                {/* Type Badge */}
                <Badge
                  variant="secondary"
                  className={cn("gap-1 mb-2", typeConfig.color)}
                >
                  <Icon className="h-3 w-3" />
                  {typeConfig.label}
                </Badge>

                {/* Title */}
                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/publications/${pub.id}`}>{pub.title}</Link>
                </h3>
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-0">
                {/* Author & Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {pub.author && !pub.isAnonymous ? (
                    <>
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={pub.author.image ?? undefined} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[100px]">
                        {pub.author.name}
                      </span>
                      <span>•</span>
                    </>
                  ) : null}
                  <time dateTime={pub.createdAt.toISOString()}>
                    {formatRelativeDate(pub.createdAt)}
                  </time>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// Utilities
// ============================================================================

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
