import { Calendar } from "lucide-react";

import { SectionHeader } from "~/components/ui/section-header";
import { api } from "~/trpc/server";

import { type AgendaDay, type WeekDay, WeeklyAgendaClient } from "./weekly-agenda-client";

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

      if (!dotMap[date]) dotMap[date] = [];
      dotMap[date]?.push(colorIdx);

      if (!eventDateMap[event.id]) eventDateMap[event.id] = [];
      eventDateMap[event.id]?.push(date);

      // For all-day events with a date range, mark dots on all days in [startDate, endDate]
      // (the router already grouped the event onto each day, but dotMap/eventDateMap need it too)
      if (
        event.eventAllDay &&
        event.eventStartAt &&
        event.eventEndAt &&
        !processedEventExtraDates.has(event.id)
      ) {
        processedEventExtraDates.add(event.id);
        const startDay = new Date(event.eventStartAt.getTime() + TZ_OFFSET_MS)
          .toISOString()
          .slice(0, 10);
        const endDay = new Date(event.eventEndAt.getTime() + TZ_OFFSET_MS)
          .toISOString()
          .slice(0, 10);
        for (const { dateStr } of weekDayNums) {
          if (dateStr >= startDay && dateStr <= endDay && dateStr !== date) {
            if (!dotMap[dateStr]) dotMap[dateStr] = [];
            dotMap[dateStr]?.push(colorIdx);
            eventDateMap[event.id]?.push(dateStr);
          }
        }
      }

      // For monthly recurrence with a day range, mark dots on all days in range
      if (
        event.eventRecurrenceType === "monthly" &&
        event.eventRecurrenceStartDay &&
        event.eventRecurrenceEndDay
      ) {
        const start = event.eventRecurrenceStartDay;
        const end = event.eventRecurrenceEndDay;
        for (const { dateStr, dayNum } of weekDayNums) {
          if (dateStr === date) continue;
          if (dayNum >= start && dayNum <= end) {
            if (!dotMap[dateStr]) dotMap[dateStr] = [];
            dotMap[dateStr]?.push(colorIdx);
            eventDateMap[event.id]?.push(dateStr);
          }
        }
      }
    }
  }

  // Serialize agenda for client (Date → ISO string)
  const clientAgenda: AgendaDay[] = agenda.map(({ date, events }) => ({
    date,
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      eventAllDay: event.eventAllDay,
      eventStartAt: event.eventStartAt ? event.eventStartAt.toISOString() : null,
      eventEndAt: event.eventEndAt ? event.eventEndAt.toISOString() : null,
      eventLocation: event.eventLocation ?? null,
      eventRecurrenceType: event.eventRecurrenceType ?? null,
      eventRecurrenceStartDay: event.eventRecurrenceStartDay ?? null,
      eventRecurrenceEndDay: event.eventRecurrenceEndDay ?? null,
      colorIndex: eventColorMap.get(event.id) ?? 0,
    })),
  }));

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
