import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import { cn } from "~/lib/utils";

// ============================================================================
// Component
// ============================================================================

interface UpcomingEventsProps {
  variant?: "grid" | "column";
}

export async function UpcomingEvents({ variant = "grid" }: UpcomingEventsProps) {
  const events = await api.publications.upcomingEvents({ limit: 4 });

  if (events.length === 0) {
    return null;
  }

  if (variant === "column") {
    return (
      <section>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Мероприятия</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" asChild>
            <Link href="/events" className="gap-1">
              Все
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event) => {
            const startAt = event.eventStartAt
              ? new Date(event.eventStartAt)
              : null;
            const isToday = startAt && isSameDay(startAt, new Date());
            const isTomorrow =
              startAt &&
              isSameDay(startAt, new Date(Date.now() + 24 * 60 * 60 * 1000));

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group block rounded-lg border bg-card hover:shadow-sm transition-shadow overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  {/* Date badge */}
                  {startAt && (
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg overflow-hidden text-center shrink-0",
                        isToday
                          ? "bg-red-500 text-white"
                          : isTomorrow
                            ? "bg-orange-500 text-white"
                            : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "text-[9px] font-medium uppercase py-0.5",
                          isToday || isTomorrow
                            ? "bg-black/10"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {formatMonth(startAt)}
                      </div>
                      <div className="text-lg font-bold">
                        {startAt.getDate()}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {startAt && (
                        <span>
                          {isToday ? "Сегодня" : isTomorrow ? "Завтра" : formatDate(startAt)}, {formatTime(startAt)}
                        </span>
                      )}
                    </div>
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
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Мероприятия</h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/events" className="gap-1">
            Все мероприятия
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => {
          const startAt = event.eventStartAt
            ? new Date(event.eventStartAt)
            : null;
          const isToday = startAt && isSameDay(startAt, new Date());
          const isTomorrow =
            startAt &&
            isSameDay(startAt, new Date(Date.now() + 24 * 60 * 60 * 1000));

          return (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Cover Image or Date Badge */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}

                {/* Date overlay */}
                {startAt && (
                  <div className="absolute top-2 left-2">
                    <div
                      className={cn(
                        "rounded-lg overflow-hidden shadow-md text-center",
                        isToday
                          ? "bg-red-500 text-white"
                          : isTomorrow
                            ? "bg-orange-500 text-white"
                            : "bg-background"
                      )}
                    >
                      <div
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-medium uppercase",
                          isToday || isTomorrow
                            ? "bg-black/10"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {formatMonth(startAt)}
                      </div>
                      <div className="px-3 py-1 text-xl font-bold">
                        {startAt.getDate()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgent badge */}
                {event.isUrgent && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    Срочно
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                {/* Title */}
                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  <Link href={`/events/${event.id}`}>{event.title}</Link>
                </h3>

                {/* Time & Location */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  {startAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>
                        {isToday
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
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{event.eventLocation}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-0">
                {/* Building & Max Attendees */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
    </section>
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

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
