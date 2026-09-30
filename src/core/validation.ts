import { compareInstants, parseInstant } from './dates';
import type { CalendarEvent } from '../types';

export type ValidatedEvent<T extends object> = {
  event: CalendarEvent<T>;
  start: NonNullable<ReturnType<typeof parseInstant>>;
  end: NonNullable<ReturnType<typeof parseInstant>>;
};

function warn(message: string): void {
  if (typeof __DEV__ === 'undefined' || __DEV__) console.warn(message);
}

export function validateEvents<T extends object>(
  events: readonly CalendarEvent<T>[]
): ValidatedEvent<T>[] {
  const seen = new Set<string>();
  const valid: ValidatedEvent<T>[] = [];

  for (const event of events) {
    if (!event.id || seen.has(event.id)) {
      warn(
        `[FullCalendar] Skipping event "${event.id || '<missing>'}": ID is missing or duplicated.`
      );
      continue;
    }
    seen.add(event.id);
    const start = parseInstant(event.start);
    const end = parseInstant(event.end);
    if (!start || !end) {
      warn(
        `[FullCalendar] Skipping event "${event.id}": start and end must be ISO timestamps with Z or an explicit offset.`
      );
      continue;
    }
    if (compareInstants(end, start) <= 0) {
      warn(
        `[FullCalendar] Skipping event "${event.id}": end must be after start.`
      );
      continue;
    }
    valid.push({ event, start, end });
  }
  return valid;
}
