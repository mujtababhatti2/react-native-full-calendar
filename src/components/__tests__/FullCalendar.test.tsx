import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FullCalendar } from '../FullCalendar';

const events = [
  {
    id: 'visit',
    title: 'Doctor visit',
    start: '2026-09-30T09:00:00+05:00',
    end: '2026-09-30T10:00:00+05:00',
    patientId: 7,
  },
];

describe('FullCalendar', () => {
  it('emits controlled navigation and view changes', () => {
    const onDateChange = jest.fn();
    const onViewChange = jest.fn();
    const screen = render(
      <FullCalendar
        events={events}
        date="2026-09-30"
        view="week"
        visibleDays={3}
        timeZone="Asia/Karachi"
        onDateChange={onDateChange}
        onViewChange={onViewChange}
        startHour={8}
        endHour={20}
      />
    );
    fireEvent.press(screen.getByLabelText('Next'));
    expect(onDateChange).toHaveBeenCalledWith('2026-10-03');
    fireEvent.press(screen.getByRole('tab', { name: 'Day' }));
    expect(onViewChange).toHaveBeenCalledWith('day');
  });

  it('preserves custom fields in event callbacks and custom renderers', () => {
    const onEventPress = jest.fn();
    const renderEvent = jest.fn(({ event }) => (
      <Text>{String(event.patientId)}</Text>
    ));
    const screen = render(
      <FullCalendar
        events={events}
        date="2026-09-30"
        view="day"
        timeZone="Asia/Karachi"
        onDateChange={jest.fn()}
        onEventPress={onEventPress}
        renderEvent={renderEvent}
        startHour={8}
        endHour={20}
      />
    );
    fireEvent.press(screen.getByTestId('event-visit-2026-09-30'));
    expect(onEventPress).toHaveBeenCalledWith(events[0]);
    expect(renderEvent.mock.calls[0]?.[0].event.patientId).toBe(7);
    expect(
      screen.getByLabelText('Doctor visit, 2026-09-30, 9:00 AM to 10:00 AM')
    ).toBeTruthy();
  });

  it('emits exclusive slot intervals', () => {
    const onSlotPress = jest.fn();
    const screen = render(
      <FullCalendar
        events={[]}
        date="2026-09-30"
        view="day"
        timeZone="Asia/Karachi"
        onDateChange={jest.fn()}
        onSlotPress={onSlotPress}
        startHour={8}
        endHour={9}
        slotDurationMinutes={30}
      />
    );
    fireEvent.press(screen.getByTestId('slot-2026-09-30-0'));
    expect(onSlotPress).toHaveBeenCalledWith({
      start: '2026-09-30T03:00:00Z',
      end: '2026-09-30T03:30:00Z',
    });
  });

  it('renders one, three, and seven visible day headers', () => {
    for (const visibleDays of [1, 3, 7] as const) {
      const screen = render(
        <FullCalendar
          events={[]}
          date="2026-09-30"
          view="week"
          visibleDays={visibleDays}
          timeZone="Asia/Karachi"
          onDateChange={jest.fn()}
          startHour={8}
          endHour={9}
        />
      );
      expect(screen.getAllByTestId(/^day-header-/)).toHaveLength(visibleDays);
      screen.unmount();
    }
  });
});
