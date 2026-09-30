import { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  addDays,
  assertTimeZone,
  dateAtHour,
  formatInstant,
  parseClockTime,
  parseDate,
  todayIn,
} from '../core/dates';
import { getVisibleDates } from '../core/visibleRange';
import { validateEvents } from '../core/validation';
import { resolveTheme } from '../theme';
import type { FullCalendarProps } from '../types';
import { CalendarHeader } from './CalendarHeader';
import { TimeGrid } from '../views/TimeGrid';

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
};
const DEFAULT_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};

export function FullCalendar<T extends object = Record<string, unknown>>({
  events,
  date,
  view,
  timeZone,
  onDateChange,
  onViewChange,
  onEventPress,
  onSlotPress,
  firstDayOfWeek = 0,
  locale = 'en-US',
  startHour = 0,
  endHour = 24,
  slotDurationMinutes = 30,
  hourHeight = 64,
  visibleDays = 7,
  scrollToTime,
  theme: themeOverride,
  renderEvent,
  renderHeader,
  dateFormat = DEFAULT_DATE_FORMAT,
  timeFormat = DEFAULT_TIME_FORMAT,
  style,
  emptyState = <Text>No events</Text>,
  testID,
}: FullCalendarProps<T>) {
  parseDate(date);
  assertTimeZone(timeZone);
  validateConfiguration({
    firstDayOfWeek,
    startHour,
    endHour,
    slotDurationMinutes,
    hourHeight,
  });
  const scheme = useColorScheme();
  const theme = resolveTheme(scheme, themeOverride);
  const dates = useMemo(
    () => getVisibleDates({ date, view, visibleDays, firstDayOfWeek }),
    [date, firstDayOfWeek, view, visibleDays]
  );
  const validEvents = useMemo(() => validateEvents(events), [events]);
  const scrollMinutes = scrollToTime
    ? parseClockTime(scrollToTime)
    : startHour * 60;
  const scrollY = Math.max(
    0,
    ((scrollMinutes - startHour * 60) / 60) * hourHeight
  );

  const count = view === 'day' ? 1 : visibleDays;
  const shift = (direction: -1 | 1) =>
    onDateChange(addDays(date, direction * count));
  const headerStart = dates[0] ?? date;
  const headerEnd = dates[dates.length - 1] ?? date;
  const labelOptions: Intl.DateTimeFormatOptions =
    dates.length === 1
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric' };
  const firstLabel = formatInstant(
    dateAtHour(headerStart, 12, timeZone).toInstant(),
    locale,
    timeZone,
    labelOptions
  );
  const lastLabel = formatInstant(
    dateAtHour(headerEnd, 12, timeZone).toInstant(),
    locale,
    timeZone,
    labelOptions
  );
  const label =
    dates.length === 1 ? firstLabel : `${firstLabel} – ${lastLabel}`;

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: theme.background }, style]}
    >
      <CalendarHeader
        label={label}
        previous={() => shift(-1)}
        next={() => shift(1)}
        today={() => onDateChange(todayIn(timeZone))}
        view={view}
        setView={(next) => onViewChange?.(next)}
        theme={theme}
        renderHeader={renderHeader}
      />
      <ScrollView
        key={`${date}:${view}:${scrollY}`}
        contentContainerStyle={styles.scrollContent}
        contentOffset={{ x: 0, y: scrollY }}
        nestedScrollEnabled
      >
        <TimeGrid
          dates={dates}
          events={validEvents}
          timeZone={timeZone}
          locale={locale}
          startHour={startHour}
          endHour={endHour}
          slotDurationMinutes={slotDurationMinutes}
          hourHeight={hourHeight}
          theme={theme}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          renderEvent={renderEvent}
          onEventPress={onEventPress}
          onSlotPress={onSlotPress}
          emptyState={emptyState}
        />
      </ScrollView>
    </View>
  );
}

function validateConfiguration({
  firstDayOfWeek,
  startHour,
  endHour,
  slotDurationMinutes,
  hourHeight,
}: {
  firstDayOfWeek: number;
  startHour: number;
  endHour: number;
  slotDurationMinutes: number;
  hourHeight: number;
}) {
  if (
    !Number.isInteger(firstDayOfWeek) ||
    firstDayOfWeek < 0 ||
    firstDayOfWeek > 6
  )
    throw new RangeError(
      'firstDayOfWeek must be an integer from 0 (Sunday) through 6 (Saturday).'
    );
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    endHour > 24 ||
    startHour >= endHour
  )
    throw new RangeError(
      'startHour and endHour must be whole hours with 0 <= startHour < endHour <= 24.'
    );
  if (!Number.isFinite(slotDurationMinutes) || slotDurationMinutes <= 0)
    throw new RangeError('slotDurationMinutes must be greater than zero.');
  if (!Number.isFinite(hourHeight) || hourHeight <= 0)
    throw new RangeError('hourHeight must be greater than zero.');
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 240 },
  scrollContent: { flexGrow: 1 },
});
