import { Suspense } from "react";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Мероприятия | SR2",
  description: "Все мероприятия ЖК SR2",
};

export default async function EventsPage() {
  return (
    <div className="container py-8">
      <PageHeader title="Мероприятия" description="Предстоящие и прошедшие мероприятия нашего ЖК" />

      {/* Events List */}
      <Suspense fallback={<EventsListSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
}

async function EventsList() {
  const { items } = await api.publications.list({ type: "event", limit: 50 });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="text-muted-foreground/50 mb-4 h-12 w-12" />
        <h3 className="font-semibold">Мероприятий пока нет</h3>
        <p className="text-muted-foreground text-sm">Скоро здесь появятся мероприятия</p>
      </div>
    );
  }

  // Separate upcoming and past events
  const now = new Date();
  const upcoming = items.filter((e) => e.eventStartAt && new Date(e.eventStartAt) > now);
  const past = items.filter((e) => !e.eventStartAt || new Date(e.eventStartAt) <= now);

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Badge variant="default">Предстоящие</Badge>
            <span className="text-muted-foreground text-sm font-normal">
              {upcoming.length} {getEventWord(upcoming.length)}
            </span>
          </h2>
          <EventsGrid events={upcoming} />
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Badge variant="secondary">Прошедшие</Badge>
            <span className="text-muted-foreground text-sm font-normal">
              {past.length} {getEventWord(past.length)}
            </span>
          </h2>
          <EventsGrid events={past} isPast />
        </section>
      )}
    </div>
  );
}

type EventItem = Awaited<ReturnType<typeof api.publications.list>>["items"][number];

function EventsGrid({ events, isPast }: { events: EventItem[]; isPast?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
        const isToday = startAt && isSameDay(startAt, new Date());
        const isTomorrow =
          startAt && isSameDay(startAt, new Date(Date.now() + 24 * 60 * 60 * 1000));

        return (
          <Card
            key={event.id}
            className={cn(
              "group overflow-hidden transition-shadow hover:shadow-md",
              isPast && "opacity-75"
            )}
          >
            {/* Cover Image or Date Badge */}
            <div className="bg-muted relative aspect-video overflow-hidden">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized={event.coverImage.includes("/uploads/")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Calendar className="text-muted-foreground/30 h-12 w-12" />
                </div>
              )}

              {/* Date overlay */}
              {startAt && (
                <div className="absolute left-2 top-2">
                  <div
                    className={cn(
                      "overflow-hidden rounded-lg text-center shadow-md",
                      isPast
                        ? "bg-muted"
                        : isToday
                          ? "bg-red-500 text-white"
                          : isTomorrow
                            ? "bg-orange-500 text-white"
                            : "bg-background"
                    )}
                  >
                    <div
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-medium uppercase",
                        isPast
                          ? "bg-muted-foreground/20"
                          : isToday || isTomorrow
                            ? "bg-black/10"
                            : "bg-primary text-primary-foreground"
                      )}
                    >
                      {formatMonth(startAt)}
                    </div>
                    <div className="px-3 py-1 text-xl font-bold">{startAt.getDate()}</div>
                  </div>
                </div>
              )}

              {/* Urgent badge */}
              {event.isUrgent && !isPast && (
                <Badge variant="destructive" className="absolute right-2 top-2">
                  Срочно
                </Badge>
              )}

              {/* Past badge */}
              {isPast && (
                <Badge variant="secondary" className="absolute right-2 top-2">
                  Завершено
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              {/* Title */}
              <h3 className="group-hover:text-primary mb-2 line-clamp-2 font-medium transition-colors">
                <Link href={`/events/${event.id}`}>{event.title}</Link>
              </h3>

              {/* Time & Location */}
              <div className="text-muted-foreground space-y-1 text-xs">
                {startAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>
                      {isPast
                        ? formatFullDate(startAt)
                        : isToday
                          ? "Сегодня"
                          : isTomorrow
                            ? "Завтра"
                            : formatDate(startAt)}
                      , {formatTime(startAt)}
                    </span>
                  </div>
                )}
                {event.eventLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{event.eventLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0">
              {/* Building & Max Attendees */}
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                {event.building && (
                  <>
                    <span>Строение {event.building.number}</span>
                    {event.eventMaxAttendees && <span>•</span>}
                  </>
                )}
                {event.eventMaxAttendees && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>до {event.eventMaxAttendees} чел.</span>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function EventsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <div className="bg-muted aspect-video animate-pulse" />
          <div className="space-y-2 p-4">
            <div className="bg-muted h-5 w-20 animate-pulse rounded" />
            <div className="bg-muted h-5 w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Utilities
// ============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
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

function getEventWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "мероприятий";
  }

  if (lastDigit === 1) {
    return "мероприятие";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "мероприятия";
  }

  return "мероприятий";
}
