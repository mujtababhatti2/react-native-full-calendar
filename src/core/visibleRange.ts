import { addDays, dayOfWeek, endOfDay, startOfDay } from './dates';
import type { CalendarView, VisibleDays } from '../types';

export type VisibleRange = {
  dates: string[];
  start: ReturnType<typeof startOfDay>;
  end: ReturnType<typeof endOfDay>;
};

export function getVisibleDates({
  date,
  view,
  visibleDays,
  firstDayOfWeek,
}: {
  date: string;
  view: CalendarView;
  visibleDays: VisibleDays;
  firstDayOfWeek: number;
}): string[] {
  const count = view === 'day' ? 1 : visibleDays;
  const start =
    count === 7
      ? addDays(date, -((dayOfWeek(date) - firstDayOfWeek + 7) % 7))
      : date;
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function getVisibleRange(
  dates: readonly string[],
  timeZone: string
): VisibleRange {
  const first = dates[0];
  const last = dates[dates.length - 1];
  if (!first || !last) throw new RangeError('Visible dates cannot be empty.');
  return {
    dates: [...dates],
    start: startOfDay(first, timeZone),
    end: endOfDay(last, timeZone),
  };
}
