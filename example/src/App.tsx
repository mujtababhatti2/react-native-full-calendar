import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  FullCalendar,
  type CalendarEvent,
  type CalendarView,
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
  const theme = useMemo(
    () => ({ primary: '#4F46E5', eventBackground: '#4F46E5' }),
    []
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <FullCalendar<Booking>
          date={date}
          events={bookings}
          view={view}
          timeZone="Asia/Karachi"
          firstDayOfWeek={1}
          startHour={8}
          endHour={20}
          visibleDays={7}
          scrollToTime="08:30"
          theme={theme}
          header={{ dayLabel: 'Daily', weekLabel: 'Schedule' }}
          styles={{
            header: styles.calendarHeader,
            headerTitle: styles.calendarTitle,
            event: styles.event,
          }}
          onDateChange={setDate}
          onViewChange={setView}
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

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  calendarHeader: { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  calendarTitle: { fontSize: 19 },
  event: { borderRadius: 8 },
  eventText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  empty: { color: '#6B7280' },
});
