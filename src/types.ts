import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type CalendarView = 'day' | 'week';
export type VisibleDays = 1 | 3 | 7;

export type CalendarEventFields = {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
};

export type CalendarEvent<T extends object = Record<string, unknown>> = T &
  CalendarEventFields;

export type CalendarSlot = {
  start: string;
  end: string;
};

export type CalendarTheme = {
  background: string;
  surface: string;
  text: string;
  secondaryText: string;
  gridLine: string;
  primary: string;
  primaryText: string;
  todayBackground: string;
  nowIndicator: string;
  eventBackground: string;
  eventText: string;
};

export type EventRenderInfo<T extends object = Record<string, unknown>> = {
  event: CalendarEvent<T>;
  startsBefore: boolean;
  endsAfter: boolean;
};

export type HeaderRenderInfo = {
  label: string;
  previous: () => void;
  next: () => void;
  today: () => void;
  view: CalendarView;
  setView: (view: CalendarView) => void;
};

export type CalendarHeaderConfig = {
  previousIcon?: ReactNode;
  nextIcon?: ReactNode;
  previousAccessibilityLabel?: string;
  nextAccessibilityLabel?: string;
  todayAccessibilityLabel?: string;
  dayLabel?: string;
  weekLabel?: string;
  showViewSwitcher?: boolean;
  renderTitle?: (info: HeaderRenderInfo) => ReactNode;
};

export type CalendarStyles = {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  headerNavigation?: StyleProp<ViewStyle>;
  headerButton?: StyleProp<ViewStyle>;
  headerButtonText?: StyleProp<TextStyle>;
  headerTitleButton?: StyleProp<ViewStyle>;
  headerTitle?: StyleProp<TextStyle>;
  viewSwitcher?: StyleProp<ViewStyle>;
  viewButton?: StyleProp<ViewStyle>;
  selectedViewButton?: StyleProp<ViewStyle>;
  viewButtonText?: StyleProp<TextStyle>;
  selectedViewButtonText?: StyleProp<TextStyle>;
  scrollContent?: StyleProp<ViewStyle>;
  dayHeaderRow?: StyleProp<ViewStyle>;
  dayHeader?: StyleProp<ViewStyle>;
  todayHeader?: StyleProp<ViewStyle>;
  dayHeaderText?: StyleProp<TextStyle>;
  todayHeaderText?: StyleProp<TextStyle>;
  timeGutter?: StyleProp<ViewStyle>;
  timeLabel?: StyleProp<TextStyle>;
  dayColumn?: StyleProp<ViewStyle>;
  event?: StyleProp<ViewStyle>;
  eventText?: StyleProp<TextStyle>;
  emptyState?: StyleProp<ViewStyle>;
};

export type FullCalendarProps<T extends object = Record<string, unknown>> = {
  events: readonly CalendarEvent<T>[];
  date: string;
  view: CalendarView;
  timeZone: string;
  onDateChange: (date: string) => void;
  onViewChange?: (view: CalendarView) => void;
  onEventPress?: (event: CalendarEvent<T>) => void;
  onSlotPress?: (slot: CalendarSlot) => void;
  firstDayOfWeek?: number;
  locale?: string;
  startHour?: number;
  endHour?: number;
  slotDurationMinutes?: number;
  hourHeight?: number;
  visibleDays?: VisibleDays;
  scrollToTime?: string;
  theme?: Partial<CalendarTheme>;
  styles?: CalendarStyles;
  header?: CalendarHeaderConfig;
  renderEvent?: (info: EventRenderInfo<T>) => ReactElement | null;
  renderHeader?: (info: HeaderRenderInfo) => ReactElement | null;
  dateFormat?: Intl.DateTimeFormatOptions;
  timeFormat?: Intl.DateTimeFormatOptions;
  style?: StyleProp<ViewStyle>;
  emptyState?: ReactNode;
  testID?: string;
};
