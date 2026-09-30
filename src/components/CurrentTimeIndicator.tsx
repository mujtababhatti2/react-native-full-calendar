import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Temporal } from 'temporal-polyfill';
import { getDayWindow } from '../core/eventLayout';
import type { CalendarTheme } from '../types';

export function CurrentTimeIndicator({
  day,
  timeZone,
  startHour,
  endHour,
  hourHeight,
  theme,
}: {
  day: string;
  timeZone: string;
  startHour: number;
  endHour: number;
  hourHeight: number;
  theme: CalendarTheme;
}) {
  const window = getDayWindow(day, timeZone, startHour, endHour, hourHeight);
  const [now, setNow] = useState(() => Temporal.Now.instant());
  useEffect(() => {
    const timer = setInterval(() => setNow(Temporal.Now.instant()), 60_000);
    return () => clearInterval(timer);
  }, []);
  if (
    Temporal.Instant.compare(now, window.start) < 0 ||
    Temporal.Instant.compare(now, window.end) >= 0
  )
    return null;
  const top =
    (Number(now.epochMilliseconds - window.start.epochMilliseconds) /
      3_600_000) *
    hourHeight;
  return (
    <View
      accessibilityLabel="Current time"
      pointerEvents="none"
      style={[styles.line, { backgroundColor: theme.nowIndicator, top }]}
    >
      <View style={[styles.dot, { backgroundColor: theme.nowIndicator }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: { height: 2, left: 0, position: 'absolute', right: 0, zIndex: 3 },
  dot: {
    borderRadius: 4,
    height: 8,
    left: -4,
    position: 'absolute',
    top: -3,
    width: 8,
  },
});
