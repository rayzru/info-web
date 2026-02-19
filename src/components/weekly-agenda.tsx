import { Calendar } from "lucide-react";

import { SectionHeader } from "~/components/ui/section-header";
import { api } from "~/trpc/server";

import { type AgendaDay, type WeekDay, WeeklyAgendaClient } from "./weekly-agenda-client";

// Moscow timezone offset
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;

function getDayName(dateStr: string): string {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short", timeZone: "UTC" }).format(
    new Date(dateStr + "T12:00:00Z")
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

  // 14 days: current week + next week
  const weekDays: WeekDay[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    return {
      dateStr,
      dayName: getDayName(dateStr),
      dayNum: getDayNumber(dateStr),
      isToday: dateStr === todayStr,
      isWeekend: i % 7 >= 5, // Сб=5, Вс=6 within each week row
    };
  });

  // Assign a color index to each unique event (by id)
  const eventColorMap = new Map<string, number>();
  let colorCounter = 0;
  for (const { events } of agenda) {
    for (const event of events) {
      if (!eventColorMap.has(event.id)) {
        eventColorMap.set(event.id, colorCounter++);
      }
    }
  }

  // dotMap: dateStr → array of colorIndex
  // For monthly recurrence with startDay/endDay, mark dots on all days in range
  const weekDayNums = weekDays.map(({ dateStr }) => ({
    dateStr,
    dayNum: getDayNumber(dateStr),
  }));

  const dotMap: Record<string, number[]> = {};
  // eventDateMap: eventId → dateStr[] (all dates this event has a dot on, for hover highlight)
  const eventDateMap: Record<string, string[]> = {};

  // Track which events have already had their extra dates added (for all-day range & recurrence)
  const processedEventExtraDates = new Set<string>();

  for (const { date, events } of agenda) {
    for (const event of events) {
      const colorIdx = eventColorMap.get(event.id) ?? 0;

      // All-day range events: handle dots + eventDateMap once via expansion below,
      // not per-day (router returns the event on every day of the range, causing duplicates)
      const isAllDayRange = event.eventAllDay && !!event.eventEndAt;

      if (!isAllDayRange) {
        // Single-day or timed events: mark dot on this day normally
        if (!dotMap[date]) dotMap[date] = [];
        dotMap[date]?.push(colorIdx);

        if (!eventDateMap[event.id]) eventDateMap[event.id] = [];
        eventDateMap[event.id]?.push(date);
      }

      // For all-day range events: mark dots on every day in [startDate, endDate] exactly once
      if (isAllDayRange && event.eventStartAt && !processedEventExtraDates.has(event.id)) {
        processedEventExtraDates.add(event.id);
        const startDay = new Date(event.eventStartAt.getTime() + TZ_OFFSET_MS)
          .toISOString()
          .slice(0, 10);
        const endDay = new Date(event.eventEndAt!.getTime() + TZ_OFFSET_MS)
          .toISOString()
          .slice(0, 10);
        if (!eventDateMap[event.id]) eventDateMap[event.id] = [];
        for (const { dateStr } of weekDayNums) {
          if (dateStr >= startDay && dateStr <= endDay) {
            if (!dotMap[dateStr]) dotMap[dateStr] = [];
            dotMap[dateStr]?.push(colorIdx);
            eventDateMap[event.id]?.push(dateStr);
          }
        }
      }
    }
  }

  // For all-day range events: show card only once (on earliest visible day).
  // Dots cover all days in range (handled above via dotMap/eventDateMap).
  const shownInAgenda = new Set<string>();

  // Serialize agenda for client — deduplicate multi-day all-day events
  const clientAgendaMap: Record<string, ReturnType<typeof buildAgendaEvent>[]> = {};

  function buildAgendaEvent(event: (typeof agenda)[number]["events"][number]) {
    return {
      id: event.id,
      title: event.title,
      eventAllDay: event.eventAllDay,
      eventStartAt: event.eventStartAt ? event.eventStartAt.toISOString() : null,
      eventEndAt: event.eventEndAt ? event.eventEndAt.toISOString() : null,
      eventLocation: event.eventLocation ?? null,
      eventRecurrenceType: event.eventRecurrenceType ?? null,
      colorIndex: eventColorMap.get(event.id) ?? 0,
    };
  }

  for (const { date, events } of agenda) {
    for (const event of events) {
      // All-day range events: only show card on the first day they appear in the window
      if (event.eventAllDay && event.eventEndAt) {
        if (shownInAgenda.has(event.id)) continue;
        shownInAgenda.add(event.id);
      }
      if (!clientAgendaMap[date]) clientAgendaMap[date] = [];
      clientAgendaMap[date]!.push(buildAgendaEvent(event));
    }
  }

  const clientAgenda: AgendaDay[] = Object.entries(clientAgendaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, events]) => events.length > 0)
    .map(([date, events]) => ({ date, events }));

  return (
    <section>
      <SectionHeader icon={Calendar} title="Календарь" href="/events" />
      <WeeklyAgendaClient
        weekDays={weekDays}
        agenda={clientAgenda}
        dotMap={dotMap}
        todayStr={todayStr}
        eventDateMap={eventDateMap}
      />
    </section>
  );
}
