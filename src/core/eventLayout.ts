import {
  compareInstants,
  dateAtHour,
  dateForInstant,
  maxInstant,
  millisecondsBetween,
  minInstant,
} from './dates';
import type { Instant } from './dates';
import type { CalendarEvent } from '../types';
import type { ValidatedEvent } from './validation';

export type EventSegment<T extends object = Record<string, unknown>> = {
  key: string;
  event: CalendarEvent<T>;
  day: string;
  start: Instant;
  end: Instant;
  top: number;
  height: number;
  column: number;
  columnCount: number;
  startsBefore: boolean;
  endsAfter: boolean;
};

type UnpositionedSegment<T extends object> = Omit<
  EventSegment<T>,
  'column' | 'columnCount'
>;

export type DayWindow = {
  start: Instant;
  end: Instant;
  durationMinutes: number;
  height: number;
};

export function getDayWindow(
  day: string,
  timeZone: string,
  startHour: number,
  endHour: number,
  hourHeight: number
): DayWindow {
  const start = dateAtHour(day, startHour, timeZone).toInstant();
  const end = dateAtHour(day, endHour, timeZone).toInstant();
  const durationMinutes = millisecondsBetween(start, end) / 60_000;
  return {
    start,
    end,
    durationMinutes,
    height: (durationMinutes / 60) * hourHeight,
  };
}

export function filterEventsInRange<T extends object>(
  events: readonly ValidatedEvent<T>[],
  start: Instant,
  end: Instant
): ValidatedEvent<T>[] {
  return events.filter(
    (event) =>
      compareInstants(event.start, end) < 0 &&
      compareInstants(event.end, start) > 0
  );
}

function orderSegments<T extends object>(
  a: UnpositionedSegment<T>,
  b: UnpositionedSegment<T>
): number {
  const start = compareInstants(a.start, b.start);
  if (start !== 0) return start;
  const aDuration = millisecondsBetween(a.start, a.end);
  const bDuration = millisecondsBetween(b.start, b.end);
  if (aDuration !== bDuration) return bDuration - aDuration;
  return a.event.id.localeCompare(b.event.id);
}

export function assignOverlapColumns<T extends object>(
  input: readonly UnpositionedSegment<T>[]
): EventSegment<T>[] {
  const segments = [...input].sort(orderSegments);
  const result: EventSegment<T>[] = [];
  let group: Array<{ segment: UnpositionedSegment<T>; column: number }> = [];
  let groupEnd: Instant | undefined;
  let columnEnds: Instant[] = [];

  const flush = () => {
    if (group.length === 0) return;
    const columnCount = Math.max(...group.map((item) => item.column)) + 1;
    for (const item of group) {
      result.push({ ...item.segment, column: item.column, columnCount });
    }
    group = [];
    groupEnd = undefined;
    columnEnds = [];
  };

  for (const segment of segments) {
    if (groupEnd && compareInstants(segment.start, groupEnd) >= 0) flush();
    let column = columnEnds.findIndex(
      (columnEnd) => compareInstants(columnEnd, segment.start) <= 0
    );
    if (column === -1) column = columnEnds.length;
    columnEnds[column] = segment.end;
    group.push({ segment, column });
    groupEnd = groupEnd ? maxInstant(groupEnd, segment.end) : segment.end;
  }
  flush();
  return result;
}

export function layoutDayEvents<T extends object>({
  events,
  day,
  timeZone,
  startHour,
  endHour,
  hourHeight,
}: {
  events: readonly ValidatedEvent<T>[];
  day: string;
  timeZone: string;
  startHour: number;
  endHour: number;
  hourHeight: number;
}): EventSegment<T>[] {
  const window = getDayWindow(day, timeZone, startHour, endHour, hourHeight);
  const visible = filterEventsInRange(events, window.start, window.end);
  const segments: UnpositionedSegment<T>[] = visible.map((item) => {
    const start = maxInstant(item.start, window.start);
    const end = minInstant(item.end, window.end);
    const top =
      (millisecondsBetween(window.start, start) / 3_600_000) * hourHeight;
    const rawHeight =
      (millisecondsBetween(start, end) / 3_600_000) * hourHeight;
    return {
      key: `${item.event.id}:${day}`,
      event: item.event,
      day,
      start,
      end,
      top,
      height: Math.max(1, rawHeight),
      startsBefore:
        compareInstants(item.start, window.start) < 0 ||
        dateForInstant(item.start, timeZone) !== day,
      endsAfter:
        compareInstants(item.end, window.end) > 0 ||
        dateForInstant(item.end.subtract({ nanoseconds: 1 }), timeZone) !== day,
    };
  });
  return assignOverlapColumns(segments);
}
