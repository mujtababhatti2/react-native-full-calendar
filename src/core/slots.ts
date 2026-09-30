import { Temporal } from 'temporal-polyfill';
import { getDayWindow } from './eventLayout';
import type { CalendarSlot } from '../types';

export function slotFromPosition({
  day,
  y,
  timeZone,
  startHour,
  endHour,
  hourHeight,
  slotDurationMinutes,
}: {
  day: string;
  y: number;
  timeZone: string;
  startHour: number;
  endHour: number;
  hourHeight: number;
  slotDurationMinutes: number;
}): CalendarSlot {
  const window = getDayWindow(day, timeZone, startHour, endHour, hourHeight);
  const elapsedMinutes = Math.max(
    0,
    Math.min(
      window.durationMinutes - slotDurationMinutes,
      (y / hourHeight) * 60
    )
  );
  const snapped =
    Math.floor(elapsedMinutes / slotDurationMinutes) * slotDurationMinutes;
  const start = window.start.add({ minutes: snapped });
  const end =
    Temporal.Instant.compare(
      start.add({ minutes: slotDurationMinutes }),
      window.end
    ) > 0
      ? window.end
      : start.add({ minutes: slotDurationMinutes });
  return { start: start.toString(), end: end.toString() };
}
