/**
 * iCal (ICS) file generation for events
 * Generates calendar files that can be imported into Google Calendar, Apple Calendar, Outlook, etc.
 */

export interface ICalEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt?: Date;
  url?: string;
  organizer?: {
    name: string;
    email?: string;
  };
}

/**
 * Format date to iCal format (YYYYMMDDTHHmmssZ)
 */
function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Escape special characters in iCal values
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Fold long lines according to iCal spec (max 75 chars)
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) return line;

  const result: string[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    if (result.length === 0) {
      result.push(remaining.slice(0, maxLength));
      remaining = remaining.slice(maxLength);
    } else {
      // Continuation lines start with a space
      result.push(" " + remaining.slice(0, maxLength - 1));
      remaining = remaining.slice(maxLength - 1);
    }
  }

  return result.join("\r\n");
}

/**
 * Generate an iCal (ICS) file content for an event
 */
export function generateICS(event: ICalEvent): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InfoWeb//Event Calendar//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${formatDateToICS(new Date())}`,
    `DTSTART:${formatDateToICS(event.startAt)}`,
  ];

  // End time (default to start + 2 hours if not specified)
  const endAt = event.endAt ?? new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000);
  lines.push(`DTEND:${formatDateToICS(endAt)}`);

  // Title
  lines.push(foldLine(`SUMMARY:${escapeICS(event.title)}`));

  // Description
  if (event.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICS(event.description)}`));
  }

  // Location
  if (event.location) {
    lines.push(foldLine(`LOCATION:${escapeICS(event.location)}`));
  }

  // URL
  if (event.url) {
    lines.push(foldLine(`URL:${event.url}`));
  }

  // Organizer
  if (event.organizer) {
    if (event.organizer.email) {
      lines.push(
        foldLine(`ORGANIZER;CN=${escapeICS(event.organizer.name)}:mailto:${event.organizer.email}`)
      );
    } else {
      lines.push(foldLine(`ORGANIZER;CN=${escapeICS(event.organizer.name)}:MAILTO:noreply@example.com`));
    }
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Generate a Google Calendar URL for an event
 */
export function generateGoogleCalendarUrl(event: ICalEvent): string {
  const params = new URLSearchParams();

  params.set("action", "TEMPLATE");
  params.set("text", event.title);

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const startStr = formatDateToICS(event.startAt);
  const endAt = event.endAt ?? new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000);
  const endStr = formatDateToICS(endAt);
  params.set("dates", `${startStr}/${endStr}`);

  if (event.description) {
    params.set("details", event.description);
  }

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate a Yahoo Calendar URL for an event
 */
export function generateYahooCalendarUrl(event: ICalEvent): string {
  const params = new URLSearchParams();

  params.set("v", "60");
  params.set("title", event.title);

  // Yahoo uses a different date format
  const startStr = event.startAt.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  params.set("st", startStr);

  const endAt = event.endAt ?? new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000);
  const endStr = endAt.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  params.set("et", endStr);

  if (event.description) {
    params.set("desc", event.description);
  }

  if (event.location) {
    params.set("in_loc", event.location);
  }

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Generate an Outlook.com calendar URL for an event
 */
export function generateOutlookCalendarUrl(event: ICalEvent): string {
  const params = new URLSearchParams();

  params.set("path", "/calendar/action/compose");
  params.set("rru", "addevent");
  params.set("subject", event.title);

  // Outlook uses ISO format
  params.set("startdt", event.startAt.toISOString());
  const endAt = event.endAt ?? new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000);
  params.set("enddt", endAt.toISOString());

  if (event.description) {
    params.set("body", event.description);
  }

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
