import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichRenderer } from "~/components/editor/renderer/rich-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getGoogleCalendarUrl, getYandexCalendarUrl } from "~/lib/ics";
import { api } from "~/trpc/server";

// ============================================================================
// Metadata
// ============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

const siteUrl = "https://sr2.ru";

function getAbsoluteImageUrl(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `${siteUrl}${image}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await api.publications.byId({ id });

    if (event.type !== "event") {
      return { title: "Не найдено" };
    }

    const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
    const description = event.eventLocation
      ? `${event.eventLocation}${startAt ? ` • ${formatMetaDate(startAt)}` : ""}`
      : startAt
        ? formatMetaDate(startAt)
        : `Мероприятие: ${event.title}`;
    const imageUrl = getAbsoluteImageUrl(event.coverImage);

    return {
      title: event.title,
      description,
      authors: event.author?.name && !event.isAnonymous ? [{ name: event.author.name }] : undefined,
      openGraph: {
        type: "article",
        title: event.title,
        description,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: event.title,
              },
            ]
          : undefined,
        publishedTime: event.createdAt.toISOString(),
        section: "Мероприятия",
      },
      twitter: {
        card: imageUrl ? "summary_large_image" : "summary",
        title: event.title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
      alternates: {
        canonical: `/events/${id}`,
      },
    };
  } catch {
    return {
      title: "Мероприятие не найдено",
    };
  }
}

function formatMetaDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ============================================================================
// Page
// ============================================================================

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await api.publications.byId({ id });
  } catch {
    notFound();
  }

  if (event.type !== "event") {
    notFound();
  }

  const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
  const endAt = event.eventEndAt ? new Date(event.eventEndAt) : null;
  const now = new Date();

  const isPast = startAt && startAt < now && (!endAt || endAt < now);
  const isOngoing = startAt && startAt <= now && endAt && endAt > now;

  // Calendar URLs
  const calendarEvent = {
    id: event.id,
    title: event.title,
    description: extractTextFromContent(event.content),
    location: event.eventLocation ?? undefined,
    startAt: startAt ?? new Date(),
    endAt: endAt ?? undefined,
  };

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/events" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Все мероприятия
        </Link>
      </Button>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <article className="flex-1">
          {/* Header */}
          <header className="mb-8">
            {/* Status Badges */}
            <div className="mb-4 flex items-center gap-2">
              {isOngoing && <Badge className="bg-green-500">Идёт сейчас</Badge>}
              {isPast && <Badge variant="secondary">Завершено</Badge>}
              {event.isUrgent && <Badge variant="destructive">Срочно</Badge>}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>

            {/* Meta */}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              {/* Author */}
              {event.author && !event.isAnonymous ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.author.image ?? undefined} />
                    <AvatarFallback>
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{event.author.name ?? "Автор"}</span>
                </div>
              ) : (
                <span>Сообщество</span>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {event.coverImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover object-center"
                priority
                unoptimized={event.coverImage.includes("/uploads/")}
              />
            </div>
          )}

          {/* Content */}
          {event.content && <RichRenderer content={event.content} className="prose-lg mb-8" />}
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 lg:w-80">
          {/* Date & Time Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-start gap-3">
                <Calendar className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <div className="font-semibold">Дата и время</div>
                  {startAt && (
                    <div className="text-muted-foreground text-sm">{formatFullDate(startAt)}</div>
                  )}
                  {startAt && (
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(startAt)}
                      {endAt && ` — ${formatTime(endAt)}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Calendar */}
              {!isPast && startAt && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Добавить в календарь
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem asChild>
                      <a href={`/api/events/${event.id}/calendar.ics`} download>
                        <Calendar className="mr-2 h-4 w-4" />
                        Скачать .ics файл
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={getGoogleCalendarUrl(calendarEvent)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Google Calendar
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={getYandexCalendarUrl(calendarEvent)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Яндекс Календарь
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>

          {/* Location Card */}
          {event.eventLocation && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-semibold">Место проведения</div>
                    <div className="text-muted-foreground text-sm">{event.eventLocation}</div>
                    {event.building && (
                      <div className="text-muted-foreground mt-1 text-xs">
                        Строение {event.building.number}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organizer Card */}
          {(event.eventOrganizer || event.eventOrganizerPhone) && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <User className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-semibold">Организатор</div>
                    {event.eventOrganizer && (
                      <div className="text-muted-foreground text-sm">{event.eventOrganizer}</div>
                    )}
                    {event.eventOrganizerPhone && (
                      <a
                        href={`tel:${event.eventOrganizerPhone}`}
                        className="text-primary mt-1 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {event.eventOrganizerPhone}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Max Attendees */}
          {event.eventMaxAttendees && event.eventMaxAttendees > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Users className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-semibold">Участники</div>
                    <div className="text-muted-foreground text-sm">
                      Максимум {event.eventMaxAttendees} человек
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Link */}
          {event.eventExternalUrl && (
            <Card>
              <CardContent className="pt-6">
                <Button asChild variant="outline" className="w-full">
                  <a href={event.eventExternalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Перейти по ссылке
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

// ============================================================================
// Utilities
// ============================================================================

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Extract text from TipTap JSON content
function extractTextFromContent(content: unknown): string {
  if (!content || typeof content !== "object") return "";

  let text = "";

  function traverse(node: unknown) {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;

    if (n.type === "text" && typeof n.text === "string") {
      text += n.text;
    }
    if (Array.isArray(n.content)) {
      n.content.forEach(traverse);
    }
  }

  traverse(content);
  return text;
}
