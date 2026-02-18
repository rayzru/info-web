import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "~/components/ui/section-header";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

// Moscow timezone offset
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;

function getDayName(dateStr: string): string {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short", timeZone: "UTC" }).format(
    new Date(dateStr + "T12:00:00Z"),
  );
}

function getDayNumber(dateStr: string): number {
  return parseInt(dateStr.slice(8, 10), 10);
}

export async function WeeklyAgenda() {
  const agenda = await api.publications.weeklyAgenda();

  // Compute Monday of current week in Moscow time
  const nowMoscow = new Date(Date.now() + TZ_OFFSET_MS);
  const todayStr = nowMoscow.toISOString().slice(0, 10); // YYYY-MM-DD

  const dayOfWeek = nowMoscow.getUTCDay(); // 0=Sun, 1=Mon...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(nowMoscow.getTime() + diffToMonday * 24 * 60 * 60 * 1000);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const eventDates = new Set(agenda.map(({ date }) => date));

  return (
    <section>
      <SectionHeader icon={Calendar} title="Календарь" href="/events" />

      {/* Week strip */}
      <div className="mt-3 mb-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((dateStr, idx) => {
            const isToday = dateStr === todayStr;
            const isWeekend = idx >= 5; // Сб=5, Вс=6
            const hasEvents = eventDates.has(dateStr);
            const dayName = getDayName(dateStr);
            const dayNum = getDayNumber(dateStr);
            const eventCount = agenda.find((a) => a.date === dateStr)?.events.length ?? 0;
            return (
              <div key={dateStr} className="flex flex-col items-center gap-1 py-1">
                <span
                  className={cn(
                    "text-[10px] capitalize",
                    isWeekend ? "text-red-400 dark:text-red-500" : "text-muted-foreground",
                  )}
                >
                  {dayName}
                </span>
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isWeekend
                        ? "text-red-400 dark:text-red-500"
                        : "text-foreground",
                  )}
                >
                  {dayNum}
                </div>
                <div className="flex h-2 items-center gap-0.5">
                  {hasEvents &&
                    Array.from({ length: Math.min(eventCount, 3) }, (_, i) => (
                      <div key={i} className="bg-primary h-1.5 w-1.5 rounded-full" />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {agenda.length === 0 ? (
        <p className="text-muted-foreground mt-2 py-4 text-center text-sm">
          Нет событий на этой неделе
        </p>
      ) : (
        <div className="space-y-4">
          {agenda.map(({ date, events }) => {
            const dayDate = new Date(date + "T00:00:00+03:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

            const isToday = dayDate.toDateString() === today.toDateString();
            const isTomorrow = dayDate.toDateString() === tomorrow.toDateString();

            const dayLabel = isToday
              ? "Сегодня"
              : isTomorrow
                ? "Завтра"
                : formatDayLabel(dayDate);

            return (
              <div key={date}>
                {/* Day header */}
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide",
                      isToday
                        ? "text-red-500"
                        : isTomorrow
                          ? "text-orange-500"
                          : "text-muted-foreground",
                    )}
                  >
                    {dayLabel}
                  </span>
                  <div className="bg-border h-px flex-1" />
                </div>

                {/* Events for this day */}
                <div className="space-y-2">
                  {events.map((event) => {
                    const startAt = event.eventStartAt
                      ? new Date(event.eventStartAt.getTime() + TZ_OFFSET_MS)
                      : null;

                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="bg-card group flex items-start gap-3 rounded-lg border p-3 transition-shadow hover:shadow-sm"
                      >
                        {/* Time column */}
                        <div className="text-muted-foreground w-10 shrink-0 pt-0.5 text-center text-xs font-medium">
                          {startAt ? formatTime(startAt) : "—"}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="group-hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
                            {event.title}
                          </p>
                          {event.eventLocation && (
                            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{event.eventLocation}</span>
                            </div>
                          )}
                          {event.eventRecurrenceType && event.eventRecurrenceType !== "none" && (
                            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>{formatRecurrence(event)}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // already offset-adjusted
  }).format(date);
}

function formatRecurrence(event: {
  eventRecurrenceType: string | null;
  eventRecurrenceStartDay: number | null;
  eventRecurrenceEndDay: number | null;
}): string {
  if (event.eventRecurrenceType === "monthly") {
    if (event.eventRecurrenceStartDay && event.eventRecurrenceEndDay) {
      return `${event.eventRecurrenceStartDay}–${event.eventRecurrenceEndDay} числа`;
    }
    return "Ежемесячно";
  }
  return "";
}
