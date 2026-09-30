import { StyleSheet, Text, View } from 'react-native';
import { formatInstant } from '../core/dates';
import { getDayWindow } from '../core/eventLayout';
import type { CalendarStyles, CalendarTheme } from '../types';

export const GUTTER_WIDTH = 60;

export function TimeGutter({
  day,
  timeZone,
  locale,
  startHour,
  endHour,
  hourHeight,
  timeFormat,
  theme,
  calendarStyles,
}: {
  day: string;
  timeZone: string;
  locale: string;
  startHour: number;
  endHour: number;
  hourHeight: number;
  timeFormat: Intl.DateTimeFormatOptions;
  theme: CalendarTheme;
  calendarStyles: CalendarStyles;
}) {
  const window = getDayWindow(day, timeZone, startHour, endHour, hourHeight);
  return (
    <View
      style={[
        styles.gutter,
        { height: window.height, backgroundColor: theme.background },
        calendarStyles.timeGutter,
      ]}
    >
      {Array.from(
        { length: Math.floor(window.durationMinutes / 60) + 1 },
        (_, index) => {
          const instant = window.start.add({ hours: index });
          const top =
            (Number(
              instant.epochMilliseconds - window.start.epochMilliseconds
            ) /
              3_600_000) *
            hourHeight;
          if (top < 0 || top > window.height) return null;
          return (
            <Text
              key={instant.toString()}
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              style={[
                styles.label,
                { color: theme.secondaryText, top: Math.max(0, top - 8) },
                calendarStyles.timeLabel,
              ]}
            >
              {formatInstant(instant, locale, timeZone, timeFormat)}
            </Text>
          );
        }
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gutter: { position: 'relative', width: GUTTER_WIDTH },
  label: {
    fontSize: 11,
    paddingRight: 6,
    position: 'absolute',
    textAlign: 'right',
    width: GUTTER_WIDTH,
  },
});
