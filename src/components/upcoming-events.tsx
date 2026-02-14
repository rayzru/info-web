import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Мероприятия</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" asChild>
            <Link href="/events" className="gap-1">
              Все
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event) => {
            const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
            const isToday = startAt && isSameDay(startAt, new Date());
            const isTomorrow =
              startAt && isSameDay(startAt, new Date(Date.now() + 24 * 60 * 60 * 1000));

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-card group block overflow-hidden rounded-lg border transition-shadow hover:shadow-sm"
              >
                <div className="flex gap-3 p-3">
                  {/* Date badge */}
                  {startAt && (
                    <div
                      className={cn(
                        "h-12 w-12 shrink-0 overflow-hidden rounded-lg text-center",
                        isToday
                          ? "bg-red-500 text-white"
                          : isTomorrow
                            ? "bg-orange-500 text-white"
                            : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "py-0.5 text-[9px] font-medium uppercase",
                          isToday || isTomorrow
                            ? "bg-black/10"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {formatMonth(startAt)}
                      </div>
                      <div className="text-lg font-bold">{startAt.getDate()}</div>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="group-hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
                      {event.title}
                    </h3>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      {startAt && (
                        <span>
                          {isToday ? "Сегодня" : isTomorrow ? "Завтра" : formatDate(startAt)},{" "}
                          {formatTime(startAt)}
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-5 w-5" />
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
          const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
          const isToday = startAt && isSameDay(startAt, new Date());
          const isTomorrow =
            startAt && isSameDay(startAt, new Date(Date.now() + 24 * 60 * 60 * 1000));

          return (
            <Card
              key={event.id}
              className="group overflow-hidden transition-shadow hover:shadow-md"
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
                      <div className="px-3 py-1 text-xl font-bold">{startAt.getDate()}</div>
                    </div>
                  </div>
                )}

                {/* Urgent badge */}
                {event.isUrgent && (
                  <Badge variant="destructive" className="absolute right-2 top-2">
                    Срочно
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
                        {isToday ? "Сегодня" : isTomorrow ? "Завтра" : formatDate(startAt)},{" "}
                        {formatTime(startAt)}
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
