import { useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  FullCalendar,
  type CalendarEvent,
  type CalendarView,
  type VisibleDays,
} from '@mujtababhatti2/react-native-full-calendar';

type Booking = { patient: string };

const bookings: CalendarEvent<Booking>[] = [
  {
    id: '1',
    title: 'Consultation',
    patient: 'Aisha',
    start: '2026-09-30T09:00:00+05:00',
    end: '2026-09-30T10:30:00+05:00',
  },
  {
    id: '2',
    title: 'Follow-up',
    patient: 'Hamza',
    start: '2026-09-30T09:30:00+05:00',
    end: '2026-09-30T11:00:00+05:00',
    color: '#0369A1',
  },
  {
    id: '3',
    title: 'Late shift',
    patient: 'Sara',
    start: '2026-09-30T19:00:00+05:00',
    end: '2026-10-01T09:00:00+05:00',
    color: '#BE123C',
  },
];

export default function App() {
  const dark = useColorScheme() === 'dark';
  const [date, setDate] = useState('2026-09-30');
  const [view, setView] = useState<CalendarView>('week');
  const [visibleDays, setVisibleDays] = useState<VisibleDays>(3);
  const [lastAction, setLastAction] = useState('React Native CLI example');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, dark && styles.safeAreaDark]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={styles.controls}>
          {([1, 3, 7] as const).map((days) => (
            <Pressable
              accessibilityRole="button"
              key={days}
              onPress={() => setVisibleDays(days)}
              style={[
                styles.control,
                visibleDays === days && styles.selectedControl,
              ]}
            >
              <Text
                style={[
                  styles.controlText,
                  visibleDays === days && styles.selectedControlText,
                ]}
              >
                {days}d
              </Text>
            </Pressable>
          ))}
        </View>
        <Text numberOfLines={1} style={styles.action}>
          {lastAction}
        </Text>
        <FullCalendar<Booking>
          date={date}
          events={bookings}
          view={view}
          timeZone="Asia/Karachi"
          firstDayOfWeek={1}
          startHour={8}
          endHour={20}
          visibleDays={visibleDays}
          scrollToTime="08:30"
          onDateChange={setDate}
          onViewChange={setView}
          onEventPress={(event) =>
            setLastAction(`${event.title}: ${event.patient}`)
          }
          onSlotPress={(slot) => setLastAction(`Slot: ${slot.start}`)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  safeAreaDark: { backgroundColor: '#111827' },
  controls: { flexDirection: 'row', gap: 8, padding: 8 },
  control: {
    borderColor: '#D1D5DB',
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  selectedControl: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  controlText: { color: '#374151', fontWeight: '600' },
  selectedControlText: { color: '#FFFFFF' },
  action: { color: '#6B7280', fontSize: 12, paddingHorizontal: 10 },
});
