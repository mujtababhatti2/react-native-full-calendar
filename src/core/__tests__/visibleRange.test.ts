import { getVisibleDates } from '../visibleRange';

describe('visible dates', () => {
  it('returns one day for day view', () => {
    expect(
      getVisibleDates({
        date: '2026-09-30',
        view: 'day',
        visibleDays: 7,
        firstDayOfWeek: 1,
      })
    ).toEqual(['2026-09-30']);
  });

  it('aligns seven days to the configured week start', () => {
    expect(
      getVisibleDates({
        date: '2026-09-30',
        view: 'week',
        visibleDays: 7,
        firstDayOfWeek: 1,
      })
    ).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
  });

  it('starts compact ranges on the controlled date', () => {
    expect(
      getVisibleDates({
        date: '2026-09-30',
        view: 'week',
        visibleDays: 3,
        firstDayOfWeek: 1,
      })
    ).toEqual(['2026-09-30', '2026-10-01', '2026-10-02']);
  });
});
