export function cleanupPhone(source: string) {
  return source.replace(/[^+\d]/g, '');
}

export const pick = <T extends {}, K extends keyof T>(obj: T, ...keys: K[]) => (
  Object.fromEntries(
    keys
      .filter(key => key in obj)
      .map(key => [key, obj[key]])
  ) as Pick<T, K>
);

export function formatPhone(source: string): string {
  const p = cleanupPhone(source);
  // eslint-disable-next-line no-irregular-whitespace
  return `${p.substring(0, 2)} (${p.substring(2, 5)}) ${p.substring(5, 8)}-${p.substring(8, 10)}-${p.substring(10, 12)}`;
}

export function formatTimeAgo(date: number) {
  // Extract the formatted date string from the object

  // Convert the date string to a Date object
  const dateObject = new Date(date);

  // Calculate the difference in seconds between the given date and the current date
  const secondsDiff = Math.round((dateObject.getTime() - Date.now()) / 1000);

  // Array representing one minute, hour, day, week, month, etc. in seconds
  const unitsInSec = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  const unitStrings = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ] as Intl.RelativeTimeFormatUnit[];

  // Find the appropriate unit based on the seconds difference
  const unitIndex = unitsInSec.findIndex(
    (cutoff) => cutoff > Math.abs(secondsDiff)
  );

  // Get the divisor to convert seconds to the appropriate unit
  const divisor = unitIndex ? unitsInSec[unitIndex - 1] : 1;

  // Initialize Intl.RelativeTimeFormat
  const rtf = new Intl.RelativeTimeFormat('ru', { style: 'short' });

  // Format the relative time based on the calculated unit
  return rtf.format(Math.floor(secondsDiff / divisor), unitStrings[unitIndex]);
}

export function monthDiff(displayFrom: Date, displayTo: Date) {
  return Math.abs(
    displayTo.getMonth() -
      displayFrom.getMonth() +
      12 * (displayTo.getFullYear() - displayFrom.getFullYear())
  );
}
