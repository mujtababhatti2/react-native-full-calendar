import { addDays, dateAtHour, parseInstant } from '../dates';
import { getDayWindow } from '../eventLayout';

describe('timezone-aware dates', () => {
  it('adds calendar days without assuming 24 hours', () => {
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09');
    expect(addDays('2026-11-01', -1)).toBe('2026-10-31');
  });

  it('rejects timestamps without an explicit offset', () => {
    expect(parseInstant('2026-09-30T09:00:00')).toBeNull();
    expect(parseInstant('2026-09-30T09:00:00+05:00')).not.toBeNull();
    expect(parseInstant('2026-09-30T04:00:00Z')).not.toBeNull();
  });

  it('measures spring-forward and fall-back windows by actual elapsed time', () => {
    expect(
      getDayWindow('2026-03-08', 'America/New_York', 0, 4, 60).durationMinutes
    ).toBe(180);
    expect(
      getDayWindow('2026-11-01', 'America/New_York', 0, 4, 60).durationMinutes
    ).toBe(300);
  });

  it('moves missing local times forward compatibly', () => {
    const missing = dateAtHour('2026-03-08', 2, 'America/New_York');
    expect(missing.hour).toBe(3);
  });
});
