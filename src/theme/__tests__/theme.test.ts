import { darkTheme, lightTheme, resolveTheme } from '..';

describe('calendar themes', () => {
  it('selects the system palette and merges partial overrides', () => {
    expect(resolveTheme('dark')).toEqual(darkTheme);
    expect(resolveTheme('light')).toEqual(lightTheme);
    expect(resolveTheme('dark', { primary: '#123456' })).toEqual({
      ...darkTheme,
      primary: '#123456',
    });
  });
});
