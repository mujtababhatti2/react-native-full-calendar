import { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
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
];

export default function App() {
  const dark = useColorScheme() === 'dark';
  const [date, setDate] = useState('2026-09-30');
  const [view, setView] = useState<CalendarView>('week');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, dark && styles.safeAreaDark]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
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
          onDateChange={setDate}
          onViewChange={setView}
          header={{ dayLabel: 'Daily', weekLabel: 'Schedule' }}
          styles={{ headerTitle: styles.calendarTitle }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  safeAreaDark: { backgroundColor: '#111827' },
  calendarTitle: { fontSize: 19 },
});
