import { Temporal } from 'temporal-polyfill';

const OFFSET_TIMESTAMP = /(?:Z|[+-]\d{2}:\d{2})$/;
const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export type Instant = Temporal.Instant;

export function parseInstant(value: string): Instant | null {
  if (!OFFSET_TIMESTAMP.test(value)) return null;
  try {
    return Temporal.Instant.from(value);
  } catch {
    return null;
  }
}

export function parseDate(value: string): Temporal.PlainDate {
  if (!CALENDAR_DATE.test(value)) {
    throw new RangeError(
      `Invalid calendar date "${value}". Expected YYYY-MM-DD.`
    );
  }
  return Temporal.PlainDate.from(value);
}

export function assertTimeZone(timeZone: string): void {
  Temporal.Now.instant().toZonedDateTimeISO(timeZone);
}

export function dateAtHour(
  date: string,
  hour: number,
  timeZone: string
): Temporal.ZonedDateTime {
  const plain = parseDate(date).add({ days: hour === 24 ? 1 : 0 });
  const normalizedHour = hour === 24 ? 0 : hour;
  return Temporal.ZonedDateTime.from(
    {
      timeZone,
      year: plain.year,
      month: plain.month,
      day: plain.day,
      hour: normalizedHour,
    },
    { disambiguation: 'compatible' }
  );
}

export function startOfDay(date: string, timeZone: string): Instant {
  return dateAtHour(date, 0, timeZone).toInstant();
}

export function endOfDay(date: string, timeZone: string): Instant {
  return dateAtHour(addDays(date, 1), 0, timeZone).toInstant();
}

export function addDays(date: string, days: number): string {
  return parseDate(date).add({ days }).toString();
}

export function dayOfWeek(date: string): number {
  return parseDate(date).dayOfWeek % 7;
}

export function dateForInstant(instant: Instant, timeZone: string): string {
  return instant.toZonedDateTimeISO(timeZone).toPlainDate().toString();
}

export function todayIn(timeZone: string): string {
  return Temporal.Now.instant()
    .toZonedDateTimeISO(timeZone)
    .toPlainDate()
    .toString();
}

export function parseClockTime(value: string): number {
  if (!CLOCK_TIME.test(value)) {
    throw new RangeError(`Invalid time "${value}". Expected HH:mm.`);
  }
  const [hour = '0', minute = '0'] = value.split(':');
  return Number(hour) * 60 + Number(minute);
}

export function instantAtMinutes(
  date: string,
  minutes: number,
  timeZone: string
): Instant {
  const plain = parseDate(date);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return Temporal.ZonedDateTime.from(
    {
      timeZone,
      year: plain.year,
      month: plain.month,
      day: plain.day,
      hour,
      minute,
    },
    { disambiguation: 'compatible' }
  ).toInstant();
}

export function formatInstant(
  instant: Instant,
  locale: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(
    new Date(Number(instant.epochMilliseconds))
  );
}

export function compareInstants(a: Instant, b: Instant): number {
  return Temporal.Instant.compare(a, b);
}

export function maxInstant(a: Instant, b: Instant): Instant {
  return compareInstants(a, b) >= 0 ? a : b;
}

export function minInstant(a: Instant, b: Instant): Instant {
  return compareInstants(a, b) <= 0 ? a : b;
}

export function millisecondsBetween(a: Instant, b: Instant): number {
  return Number(b.epochMilliseconds - a.epochMilliseconds);
}
