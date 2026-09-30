import type { ColorSchemeName } from 'react-native';
import type { CalendarTheme } from '../types';

export const lightTheme: CalendarTheme = {
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  secondaryText: '#6B7280',
  gridLine: '#E5E7EB',
  primary: '#6D28D9',
  primaryText: '#FFFFFF',
  todayBackground: '#EDE9FE',
  nowIndicator: '#DC2626',
  eventBackground: '#6D28D9',
  eventText: '#FFFFFF',
};

export const darkTheme: CalendarTheme = {
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  secondaryText: '#9CA3AF',
  gridLine: '#374151',
  primary: '#A78BFA',
  primaryText: '#111827',
  todayBackground: '#312E81',
  nowIndicator: '#F87171',
  eventBackground: '#7C3AED',
  eventText: '#FFFFFF',
};

export function resolveTheme(
  scheme: ColorSchemeName | null | undefined,
  override?: Partial<CalendarTheme>
): CalendarTheme {
  return { ...(scheme === 'dark' ? darkTheme : lightTheme), ...override };
}
