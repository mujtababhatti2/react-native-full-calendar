import { useMemo } from 'react';
import { I18nManager, Pressable, StyleSheet, Text, View } from 'react-native';
import { dateAtHour, formatInstant, todayIn } from '../core/dates';
import { getDayWindow, layoutDayEvents } from '../core/eventLayout';
import { slotFromPosition } from '../core/slots';
import type { ValidatedEvent } from '../core/validation';
import type {
  CalendarEvent,
  CalendarSlot,
  CalendarStyles,
  CalendarTheme,
  EventRenderInfo,
} from '../types';
import { CurrentTimeIndicator } from '../components/CurrentTimeIndicator';
import { EventCard } from '../components/EventCard';
import { GUTTER_WIDTH, TimeGutter } from '../components/TimeGutter';

export function TimeGrid<T extends object>({
  dates,
  events,
  timeZone,
  locale,
  startHour,
  endHour,
  slotDurationMinutes,
  hourHeight,
  theme,
  calendarStyles,
  dateFormat,
  timeFormat,
  renderEvent,
  onEventPress,
  onSlotPress,
  emptyState,
}: {
  dates: readonly string[];
  events: readonly ValidatedEvent<T>[];
  timeZone: string;
  locale: string;
  startHour: number;
  endHour: number;
  slotDurationMinutes: number;
  hourHeight: number;
  theme: CalendarTheme;
  calendarStyles: CalendarStyles;
  dateFormat: Intl.DateTimeFormatOptions;
  timeFormat: Intl.DateTimeFormatOptions;
  renderEvent?: (info: EventRenderInfo<T>) => React.ReactElement | null;
  onEventPress?: (event: CalendarEvent<T>) => void;
  onSlotPress?: (slot: CalendarSlot) => void;
  emptyState?: React.ReactNode;
}) {
  const firstDay = dates[0];
  if (!firstDay) return null;
  const today = todayIn(timeZone);
  const dayWidth = `${100 / dates.length}%` as const;
  const hasEvents = dates.some(
    (day) =>
      layoutDayEvents({ events, day, timeZone, startHour, endHour, hourHeight })
        .length > 0
  );

  return (
    <View style={{ backgroundColor: theme.background }}>
      <View
        style={[
          styles.dayHeaders,
          {
            borderBottomColor: theme.gridLine,
          },
          I18nManager.isRTL ? styles.rtlHeaderSpacer : styles.ltrHeaderSpacer,
          I18nManager.isRTL && styles.rowReverse,
          calendarStyles.dayHeaderRow,
        ]}
      >
        {dates.map((day) => {
          const noon = dateAtHour(day, 12, timeZone).toInstant();
          const selected = day === today;
          return (
            <View
              accessibilityLabel={`${formatInstant(noon, locale, timeZone, dateFormat)}${selected ? ', today' : ''}`}
              key={day}
              testID={`day-header-${day}`}
              style={[
                styles.dayHeader,
                { width: dayWidth },
                selected && { backgroundColor: theme.todayBackground },
                calendarStyles.dayHeader,
                selected && calendarStyles.todayHeader,
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.5}
                numberOfLines={1}
                style={[
                  styles.dayHeaderText,
                  { color: selected ? theme.primary : theme.text },
                  calendarStyles.dayHeaderText,
                  selected && calendarStyles.todayHeaderText,
                ]}
              >
                {formatInstant(noon, locale, timeZone, dateFormat)}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={[styles.row, I18nManager.isRTL && styles.rowReverse]}>
        <TimeGutter
          day={firstDay}
          timeZone={timeZone}
          locale={locale}
          startHour={startHour}
          endHour={endHour}
          hourHeight={hourHeight}
          timeFormat={timeFormat}
          theme={theme}
          calendarStyles={calendarStyles}
        />
        <View style={[styles.days, I18nManager.isRTL && styles.rowReverse]}>
          {dates.map((day) => (
            <DayColumn
              key={day}
              day={day}
              width={dayWidth}
              events={events}
              timeZone={timeZone}
              locale={locale}
              startHour={startHour}
              endHour={endHour}
              slotDurationMinutes={slotDurationMinutes}
              hourHeight={hourHeight}
              timeFormat={timeFormat}
              theme={theme}
              calendarStyles={calendarStyles}
              renderEvent={renderEvent}
              onEventPress={onEventPress}
              onSlotPress={onSlotPress}
            />
          ))}
          {!hasEvents && emptyState ? (
            <View
              pointerEvents="none"
              style={[styles.empty, calendarStyles.emptyState]}
            >
              {emptyState}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function DayColumn<T extends object>({
  day,
  width,
  events,
  timeZone,
  locale,
  startHour,
  endHour,
  slotDurationMinutes,
  hourHeight,
  timeFormat,
  theme,
  calendarStyles,
  renderEvent,
  onEventPress,
  onSlotPress,
}: {
  day: string;
  width: `${number}%`;
  events: readonly ValidatedEvent<T>[];
  timeZone: string;
  locale: string;
  startHour: number;
  endHour: number;
  slotDurationMinutes: number;
  hourHeight: number;
  timeFormat: Intl.DateTimeFormatOptions;
  theme: CalendarTheme;
  calendarStyles: CalendarStyles;
  renderEvent?: (info: EventRenderInfo<T>) => React.ReactElement | null;
  onEventPress?: (event: CalendarEvent<T>) => void;
  onSlotPress?: (slot: CalendarSlot) => void;
}) {
  const window = getDayWindow(day, timeZone, startHour, endHour, hourHeight);
  const segments = useMemo(
    () =>
      layoutDayEvents({
        events,
        day,
        timeZone,
        startHour,
        endHour,
        hourHeight,
      }),
    [day, endHour, events, hourHeight, startHour, timeZone]
  );
  const slotCount = Math.ceil(window.durationMinutes / slotDurationMinutes);

  return (
    <View
      style={[
        styles.column,
        { borderLeftColor: theme.gridLine, height: window.height, width },
        calendarStyles.dayColumn,
      ]}
    >
      {Array.from(
        { length: Math.ceil(window.durationMinutes / 60) + 1 },
        (_, index) => (
          <View
            key={index}
            pointerEvents="none"
            style={[
              styles.gridLine,
              { backgroundColor: theme.gridLine, top: index * hourHeight },
            ]}
          />
        )
      )}
      {onSlotPress
        ? Array.from({ length: slotCount }, (_, index) => {
            const top = (index * slotDurationMinutes * hourHeight) / 60;
            return (
              <Pressable
                accessibilityLabel={`Select ${day} time slot`}
                accessibilityRole="button"
                key={index}
                onPress={() =>
                  onSlotPress(
                    slotFromPosition({
                      day,
                      y: top,
                      timeZone,
                      startHour,
                      endHour,
                      hourHeight,
                      slotDurationMinutes,
                    })
                  )
                }
                style={[
                  styles.slot,
                  { height: (slotDurationMinutes * hourHeight) / 60, top },
                ]}
                testID={`slot-${day}-${index}`}
              />
            );
          })
        : null}
      {segments.map((segment) => (
        <EventCard
          key={segment.key}
          segment={segment}
          locale={locale}
          timeZone={timeZone}
          timeFormat={timeFormat}
          theme={theme}
          calendarStyles={calendarStyles}
          renderEvent={renderEvent}
          onPress={onEventPress ? () => onEventPress(segment.event) : undefined}
        />
      ))}
      <CurrentTimeIndicator
        day={day}
        timeZone={timeZone}
        startHour={startHour}
        endHour={endHour}
        hourHeight={hourHeight}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowReverse: { flexDirection: 'row-reverse' },
  dayHeaders: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  ltrHeaderSpacer: { paddingLeft: GUTTER_WIDTH },
  rtlHeaderSpacer: { paddingRight: GUTTER_WIDTH },
  dayHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 2,
  },
  dayHeaderText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  days: { flex: 1, flexDirection: 'row', position: 'relative' },
  column: { borderLeftWidth: StyleSheet.hairlineWidth, position: 'relative' },
  gridLine: {
    height: StyleSheet.hairlineWidth,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  slot: { left: 0, minHeight: 1, position: 'absolute', right: 0 },
  empty: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
