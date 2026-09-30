import { slotFromPosition } from '../slots';

describe('slot calculation', () => {
  it('snaps a touch down to the configured interval', () => {
    expect(
      slotFromPosition({
        day: '2026-09-30',
        y: 95,
        timeZone: 'Asia/Karachi',
        startHour: 8,
        endHour: 20,
        hourHeight: 60,
        slotDurationMinutes: 30,
      })
    ).toEqual({
      start: '2026-09-30T04:30:00Z',
      end: '2026-09-30T05:00:00Z',
    });
  });
});
