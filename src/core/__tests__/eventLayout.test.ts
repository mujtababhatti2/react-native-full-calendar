import { layoutDayEvents } from '../eventLayout';
import { validateEvents } from '../validation';

const event = (id: string, start: string, end: string) => ({
  id,
  title: id,
  start,
  end,
});

describe('event layout', () => {
  it('treats boundary-touching events as non-overlapping', () => {
    const events = validateEvents([
      event('a', '2026-09-30T09:00:00+05:00', '2026-09-30T10:00:00+05:00'),
      event('b', '2026-09-30T10:00:00+05:00', '2026-09-30T11:00:00+05:00'),
    ]);
    const result = layoutDayEvents({
      events,
      day: '2026-09-30',
      timeZone: 'Asia/Karachi',
      startHour: 8,
      endHour: 20,
      hourHeight: 60,
    });
    expect(result.map((item) => item.columnCount)).toEqual([1, 1]);
  });

  it('groups directly and transitively overlapping events', () => {
    const events = validateEvents([
      event('a', '2026-09-30T09:00:00+05:00', '2026-09-30T11:00:00+05:00'),
      event('b', '2026-09-30T10:00:00+05:00', '2026-09-30T12:00:00+05:00'),
      event('c', '2026-09-30T11:30:00+05:00', '2026-09-30T13:00:00+05:00'),
    ]);
    const result = layoutDayEvents({
      events,
      day: '2026-09-30',
      timeZone: 'Asia/Karachi',
      startHour: 8,
      endHour: 20,
      hourHeight: 60,
    });
    expect(result.map((item) => item.columnCount)).toEqual([2, 2, 2]);
    expect(result.map((item) => item.column)).toEqual([0, 1, 0]);
  });

  it('clips visible hours and splits cross-midnight events', () => {
    const events = validateEvents([
      event(
        'overnight',
        '2026-09-30T19:00:00+05:00',
        '2026-10-01T09:00:00+05:00'
      ),
    ]);
    const first = layoutDayEvents({
      events,
      day: '2026-09-30',
      timeZone: 'Asia/Karachi',
      startHour: 8,
      endHour: 20,
      hourHeight: 60,
    });
    const second = layoutDayEvents({
      events,
      day: '2026-10-01',
      timeZone: 'Asia/Karachi',
      startHour: 8,
      endHour: 20,
      hourHeight: 60,
    });
    expect(first[0]).toMatchObject({ top: 660, height: 60, endsAfter: true });
    expect(second[0]).toMatchObject({ top: 0, height: 60, startsBefore: true });
    expect(first[0]?.event).toBe(second[0]?.event);
  });

  it('orders equal starts by longer duration and then ID', () => {
    const events = validateEvents([
      event('z', '2026-09-30T09:00:00+05:00', '2026-09-30T10:00:00+05:00'),
      event('b', '2026-09-30T09:00:00+05:00', '2026-09-30T11:00:00+05:00'),
      event('a', '2026-09-30T09:00:00+05:00', '2026-09-30T11:00:00+05:00'),
    ]);
    const result = layoutDayEvents({
      events,
      day: '2026-09-30',
      timeZone: 'Asia/Karachi',
      startHour: 8,
      endHour: 20,
      hourHeight: 60,
    });
    expect(result.map((item) => item.event.id)).toEqual(['a', 'b', 'z']);
  });
});
