import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  FullCalendar,
  type CalendarEvent,
  type CalendarSlot,
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
  {
    id: '4',
    title: 'Review',
    patient: 'Bilal',
    start: '2026-10-01T13:00:00+05:00',
    end: '2026-10-01T13:20:00+05:00',
  },
];

export default function App() {
  const [date, setDate] = useState('2026-09-30');
  const [view, setView] = useState<CalendarView>('week');
  const [visibleDays, setVisibleDays] = useState<VisibleDays>(3);
  const [locale, setLocale] = useState('en-PK');
  const [lastAction, setLastAction] = useState('Ready');
  const theme = useMemo(
    () => ({ primary: '#4F46E5', eventBackground: '#4F46E5' }),
    []
  );

  const showSlot = (slot: CalendarSlot) =>
    setLastAction(`Slot: ${slot.start} – ${slot.end}`);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <View style={styles.controls}>
          {[1, 3, 7].map((days) => (
            <Control
              key={days}
              label={`${days}d`}
              selected={visibleDays === days}
              onPress={() => setVisibleDays(days as VisibleDays)}
            />
          ))}
          <Control
            label={locale === 'en-PK' ? 'Urdu' : 'English'}
            onPress={() =>
              setLocale((value) => (value === 'en-PK' ? 'ur-PK' : 'en-PK'))
            }
          />
        </View>
        <Text numberOfLines={1} style={styles.action}>
          {lastAction}
        </Text>
        <FullCalendar<Booking>
          date={date}
          events={bookings}
          view={view}
          timeZone="Asia/Karachi"
          locale={locale}
          firstDayOfWeek={1}
          startHour={8}
          endHour={20}
          visibleDays={visibleDays}
          scrollToTime="08:30"
          theme={theme}
          onDateChange={setDate}
          onViewChange={setView}
          onEventPress={(event) =>
            setLastAction(`${event.title}: ${event.patient}`)
          }
          onSlotPress={showSlot}
          renderEvent={({ event, endsAfter }) => (
            <Text numberOfLines={2} style={styles.eventText}>
              {event.title}
              {endsAfter ? ' →' : ''}
            </Text>
          )}
          emptyState={
            <Text style={styles.empty}>No bookings in this range</Text>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Control({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.control, selected && styles.selectedControl]}
    >
      <Text
        style={[styles.controlText, selected && styles.selectedControlText]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
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
  action: {
    color: '#4B5563',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  eventText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  empty: { color: '#6B7280' },
});
