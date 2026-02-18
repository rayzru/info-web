"use client";

import { useState } from "react";

import { MapPin } from "lucide-react";
import Link from "next/link";

import { cn } from "~/lib/utils";

// Warm color palette (5 colors cycling)
const EVENT_COLORS = [
  { dot: "bg-amber-500", bar: "bg-amber-500", barLight: "bg-amber-400" },
  { dot: "bg-orange-500", bar: "bg-orange-500", barLight: "bg-orange-400" },
  { dot: "bg-rose-500", bar: "bg-rose-500", barLight: "bg-rose-400" },
  { dot: "bg-pink-500", bar: "bg-pink-500", barLight: "bg-pink-400" },
  { dot: "bg-red-500", bar: "bg-red-500", barLight: "bg-red-400" },
  { dot: "bg-fuchsia-500", bar: "bg-fuchsia-500", barLight: "bg-fuchsia-400" },
  { dot: "bg-yellow-500", bar: "bg-yellow-500", barLight: "bg-yellow-400" },
] as const;

// eventId → Set of dates this event appears on (for hover highlight)
type EventDateMap = Record<string, string[]>;

export interface AgendaEvent {
  id: string;
  title: string;
  eventStartAt: string | null; // ISO string
  eventEndAt: string | null; // ISO string
  eventLocation: string | null;
  eventRecurrenceType: string | null;
  eventRecurrenceStartDay: number | null;
  eventRecurrenceEndDay: number | null;
  colorIndex: number;
}

export interface AgendaDay {
  date: string; // YYYY-MM-DD
  events: AgendaEvent[];
}

export interface WeekDay {
  dateStr: string;
  dayName: string;
  dayNum: number;
  isToday: boolean;
  isWeekend: boolean;
}

interface WeeklyAgendaClientProps {
  weekDays: WeekDay[]; // 14 days
  agenda: AgendaDay[];
  dotMap: Record<string, number[]>; // dateStr → colorIndex[]
  todayStr: string;
  eventDateMap: EventDateMap; // eventId → dateStr[]
}

export function WeeklyAgendaClient({
  weekDays,
  agenda,
  dotMap,
  todayStr,
  eventDateMap,
}: WeeklyAgendaClientProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Which dates are highlighted (from hovering an event card)
  const highlightedDates = hoveredEventId ? new Set(eventDateMap[hoveredEventId] ?? []) : null;

  // Which events are highlighted (from hovering a date cell)
  const highlightedEventIds = hoveredDate
    ? new Set(
        agenda
          .filter((a) => a.date === hoveredDate)
          .flatMap((a) => a.events.map((e) => e.id)),
      )
    : null;

  // Week rows: 2 rows of 7
  const week1 = weekDays.slice(0, 7);
  const week2 = weekDays.slice(7, 14);
  const dayHeaders = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <>
      {/* Week strip — 2 weeks */}
      <div className="mb-4 mt-3 select-none">
        {/* Day-of-week header row (shown once) */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayHeaders.map((name, i) => (
            <div key={name} className="flex justify-center">
              <span
                className={cn(
                  "text-[10px] capitalize",
                  i >= 5 ? "text-red-400 dark:text-red-500" : "text-muted-foreground",
                )}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Two rows of date cells */}
        {[week1, week2].map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 gap-1 mb-1">
            {row.map(({ dateStr, dayNum, isToday, isWeekend }) => {
              const dots = dotMap[dateStr] ?? [];
              const isHighlighted = highlightedDates?.has(dateStr) ?? false;
              const isHovered = hoveredDate === dateStr;

              return (
                <div
                  key={dateStr}
                  className="flex flex-col items-center gap-1 rounded-lg py-1 transition-colors cursor-default"
                  onMouseEnter={() => setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-all",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : isHovered || isHighlighted
                          ? "bg-muted ring-primary/40 ring-2"
                          : isWeekend
                            ? "text-red-400 dark:text-red-500"
                            : "text-foreground",
                    )}
                  >
                    {dayNum}
                  </div>
                  {/* Event dots */}
                  <div className="flex h-2 items-center gap-0.5">
                    {dots.slice(0, 3).map((colorIdx, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-all",
                          (isHovered || isHighlighted) ? "scale-125" : "",
                          EVENT_COLORS[colorIdx % EVENT_COLORS.length]?.dot,
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Agenda */}
      {agenda.length === 0 ? (
        <p className="text-muted-foreground mt-2 py-4 text-center text-sm">
          Нет событий на ближайшие две недели
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

                {/* Events */}
                <div className="space-y-2">
                  {events.map((event) => {
                    const color = EVENT_COLORS[event.colorIndex % EVENT_COLORS.length]!;
                    const startAt = event.eventStartAt ? new Date(event.eventStartAt) : null;
                    const endAt = event.eventEndAt ? new Date(event.eventEndAt) : null;

                    const isEventHighlighted =
                      highlightedEventIds?.has(event.id) ??
                      (hoveredEventId ? hoveredEventId === event.id : false);

                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className={cn(
                          "bg-card group flex overflow-hidden rounded-lg border transition-all",
                          isEventHighlighted
                            ? "shadow-md ring-1 ring-inset ring-border"
                            : "hover:shadow-sm",
                        )}
                        onMouseEnter={() => setHoveredEventId(event.id)}
                        onMouseLeave={() => setHoveredEventId(null)}
                      >
                        {/* Color bar */}
                        <div className={cn("w-1 shrink-0 transition-all", color.bar)} />

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col gap-1 p-3">
                          {/* Title — primary focus, up to 2 lines */}
                          <p className="group-hover:text-primary line-clamp-2 text-sm font-medium leading-snug transition-colors">
                            {event.title}
                          </p>

                          {/* Bottom row: date/time + location */}
                          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                            {startAt && (
                              <span>
                                {endAt
                                  ? `${formatDateTime(startAt)} — ${formatDateTime(endAt)}`
                                  : formatDateTime(startAt)}
                              </span>
                            )}
                            {event.eventLocation && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {event.eventLocation}
                              </span>
                            )}
                          </div>
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
    </>
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

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(date);
}
