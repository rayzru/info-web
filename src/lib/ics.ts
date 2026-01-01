/**
 * ICS (iCalendar) file generator for events
 * @see https://datatracker.ietf.org/doc/html/rfc5545
 */

interface ICSEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt?: Date;
  url?: string;
  organizer?: string;
}

/**
 * Format date to ICS format: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Escape special characters in ICS text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Fold long lines according to RFC 5545 (max 75 octets per line)
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) return line;

  const result: string[] = [];
  let remaining = line;

  while (remaining.length > maxLength) {
    result.push(remaining.slice(0, maxLength));
    remaining = " " + remaining.slice(maxLength);
  }
  result.push(remaining);

  return result.join("\r\n");
}

/**
 * Generate ICS file content for an event
 */
export function generateICS(event: ICSEvent): string {
  const now = new Date();
  const uid = `${event.id}@sr2.ru`;

  // Default end time: 2 hours after start if not specified
  const endAt = event.endAt ?? new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SR2//Events//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(event.startAt)}`,
    `DTEND:${formatICSDate(endAt)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    lines.push(`ORGANIZER;CN=${escapeICSText(event.organizer)}:mailto:noreply@sr2.ru`);
  }

  // Add alarm 1 hour before
  lines.push(
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICSText(event.title)} через 1 час`,
    "TRIGGER:-PT1H",
    "END:VALARM"
  );

  lines.push("END:VEVENT", "END:VCALENDAR");

  // Fold long lines and join with CRLF
  return lines.map(foldLine).join("\r\n");
}

/**
 * Generate ICS download URL for an event
 */
export function getICSDownloadUrl(eventId: string): string {
  return `/api/events/${eventId}/calendar.ics`;
}

/**
 * Generate Google Calendar URL
 */
export function getGoogleCalendarUrl(event: ICSEvent): string {
  const startAt = formatICSDate(event.startAt);
  const endAt = event.endAt
    ? formatICSDate(event.endAt)
    : formatICSDate(new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000));

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startAt}/${endAt}`,
  });

  if (event.description) {
    params.set("details", event.description);
  }

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Yandex Calendar URL
 */
export function getYandexCalendarUrl(event: ICSEvent): string {
  const startAt = formatICSDate(event.startAt);
  const endAt = event.endAt
    ? formatICSDate(event.endAt)
    : formatICSDate(new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000));

  const params = new URLSearchParams({
    name: event.title,
    from: startAt,
    to: endAt,
  });

  if (event.description) {
    params.set("desc", event.description);
  }

  if (event.location) {
    params.set("where", event.location);
  }

  return `https://calendar.yandex.ru/event/edit?${params.toString()}`;
}
