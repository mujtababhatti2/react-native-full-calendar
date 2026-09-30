import { Pressable, StyleSheet, Text } from 'react-native';
import { formatInstant } from '../core/dates';
import type { EventSegment } from '../core/eventLayout';
import type { CalendarTheme, EventRenderInfo } from '../types';

export function EventCard<T extends object>({
  segment,
  locale,
  timeZone,
  timeFormat,
  theme,
  renderEvent,
  onPress,
}: {
  segment: EventSegment<T>;
  locale: string;
  timeZone: string;
  timeFormat: Intl.DateTimeFormatOptions;
  theme: CalendarTheme;
  renderEvent?: (info: EventRenderInfo<T>) => React.ReactElement | null;
  onPress?: () => void;
}) {
  const startLabel = formatInstant(segment.start, locale, timeZone, timeFormat);
  const endLabel = formatInstant(segment.end, locale, timeZone, timeFormat);
  const label = `${segment.event.title}, ${segment.day}, ${startLabel} to ${endLabel}`;
  const left = `${(segment.column / segment.columnCount) * 100}%` as const;
  const width = `${100 / segment.columnCount}%` as const;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={!onPress}
      hitSlop={onPress ? { top: 11, bottom: 11 } : undefined}
      onPress={onPress}
      testID={`event-${segment.event.id}-${segment.day}`}
      style={[
        styles.card,
        {
          backgroundColor: segment.event.color ?? theme.eventBackground,
          height: Math.max(segment.height, 22),
          left,
          top: segment.top,
          width,
        },
      ]}
    >
      {renderEvent ? (
        renderEvent({
          event: segment.event,
          startsBefore: segment.startsBefore,
          endsAfter: segment.endsAfter,
        })
      ) : (
        <Text
          maxFontSizeMultiplier={1.4}
          numberOfLines={segment.height < 38 ? 1 : 2}
          style={[styles.text, { color: theme.eventText }]}
        >
          {segment.event.title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    minHeight: 22,
    overflow: 'hidden',
    padding: 3,
    position: 'absolute',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
