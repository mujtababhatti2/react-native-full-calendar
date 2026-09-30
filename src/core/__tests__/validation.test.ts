import { validateEvents } from '../validation';

describe('event validation', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  afterEach(() => warn.mockClear());
  afterAll(() => warn.mockRestore());

  it('preserves custom event fields', () => {
    const [validated] = validateEvents([
      {
        id: 'a',
        title: 'Visit',
        start: '2026-09-30T09:00:00+05:00',
        end: '2026-09-30T10:00:00+05:00',
        patientId: 42,
      },
    ]);
    expect(validated?.event.patientId).toBe(42);
  });

  it('skips malformed ranges and duplicate IDs', () => {
    const result = validateEvents([
      {
        id: 'bad',
        title: 'Bad',
        start: '2026-09-30T10:00:00',
        end: '2026-09-30T09:00:00Z',
      },
      {
        id: 'same',
        title: 'First',
        start: '2026-09-30T09:00:00Z',
        end: '2026-09-30T10:00:00Z',
      },
      {
        id: 'same',
        title: 'Second',
        start: '2026-09-30T11:00:00Z',
        end: '2026-09-30T12:00:00Z',
      },
      {
        id: 'reverse',
        title: 'Reverse',
        start: '2026-09-30T12:00:00Z',
        end: '2026-09-30T11:00:00Z',
      },
    ]);
    expect(result.map((item) => item.event.title)).toEqual(['First']);
    expect(warn).toHaveBeenCalledTimes(3);
  });
});
