# React Native Full Calendar

A React Native calendar library for displaying timed events in controlled, timezone-aware day and week views. This React Native full calendar provides a typed `FullCalendar` component with overlapping event layout, press callbacks, and custom themes and renderers.

## Supported Features and Use Cases

- Day view and week view with one, three, or seven visible days.
- Timed events arranged in columns when they overlap, with cross-midnight events split across days.
- IANA timezone support, daylight saving time handling, localized labels, and a current-time indicator.
- Previous, next, and today navigation; event and time-slot press callbacks.
- Automatic system light/dark themes, per-event colors, style overrides, and custom event and header content.
- TypeScript exports that preserve your custom event fields in callbacks and renderers.

Use it as a React Native event calendar for meetings or shifts, or a React Native scheduling calendar for a team's daily timetable. For a React Native appointment calendar, use slot presses to open your own booking form and event presses to show appointment details. Your app supplies the events and handles booking rules and persistence.

## Platforms and Requirements

This is a React Native calendar for Android and iOS, with example apps for Expo and bare React Native CLI. The library contains no native module of its own.

- Peer dependencies: React `>=18` and React Native `>=0.76`, as declared in `package.json`. These ranges are requirements, not a tested compatibility matrix.
- The checked-in examples use React `19.2.3` and React Native `0.86.3`; the Expo example uses Expo `57`.
- The runtime must support `Intl.DateTimeFormat` with the requested locale and timezone. Date calculations use the bundled dependency `temporal-polyfill`.
- Render the calendar inside a container with available height, such as a screen with `flex: 1`. The component itself uses `flex: 1` and a minimum height of 240.

React Native Web is not a supported target in this release.

## Preview

<img src="./docs/react-native-full-calendar.png" alt="Three-day calendar view running in the React Native CLI example on Android" width="360" />

## Installation

```sh
npm install @mujtababhatti2/react-native-full-calendar
```

`temporal-polyfill` is installed automatically as a regular dependency. Install the library in an existing React Native or Expo app that meets the peer dependency requirements above.

## React Native Calendar Usage

This React Native TypeScript calendar example renders a three-day appointment schedule. Import the React Native calendar component and its event and view types from the package root.

```tsx
import { useState } from 'react';
import {
  FullCalendar,
  type CalendarEvent,
  type CalendarView,
} from '@mujtababhatti2/react-native-full-calendar';

type Appointment = { patientId: string };

const events: CalendarEvent<Appointment>[] = [
  {
    id: 'appointment-1',
    title: 'Consultation',
    patientId: 'patient-42',
    start: '2026-09-30T09:00:00+05:00',
    end: '2026-09-30T10:00:00+05:00',
  },
];

export function Schedule() {
  const [date, setDate] = useState('2026-09-30');
  const [view, setView] = useState<CalendarView>('week');

  return (
    <FullCalendar<Appointment>
      events={events}
      date={date}
      view={view}
      timeZone="Asia/Karachi"
      firstDayOfWeek={1}
      visibleDays={3}
      startHour={8}
      endHour={20}
      onDateChange={setDate}
      onViewChange={setView}
      onEventPress={(event) => console.log(event.patientId)}
      onSlotPress={(slot) => console.log(slot.start, slot.end)}
    />
  );
}
```

The calendar is controlled: it never changes `date`, `view`, or `events` internally. Navigation and view controls request changes through callbacks. The consuming app owns persistence, booking confirmation, conflict checks, optimistic updates, and rollback.

## API Reference

### Required props

| Prop           | Type                          | Meaning                                      |
| -------------- | ----------------------------- | -------------------------------------------- |
| `events`       | `readonly CalendarEvent<T>[]` | Timed events with stable IDs                 |
| `date`         | `YYYY-MM-DD`                  | Controlled calendar date in `timeZone`       |
| `view`         | `'day' \| 'week'`             | Controlled view                              |
| `timeZone`     | IANA timezone                 | Timezone used for ranges, labels, and layout |
| `onDateChange` | `(date) => void`              | Receives navigation requests                 |

### Configuration and Callbacks

| Prop                        | Default            | Meaning                                                                                      |
| --------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `visibleDays`               | `7`                | `1`, `3`, or `7` columns in week view                                                        |
| `firstDayOfWeek`            | `0`                | Sunday (`0`) through Saturday (`6`); applies to seven-day ranges                             |
| `startHour` / `endHour`     | `0` / `24`         | Visible whole-hour range                                                                     |
| `slotDurationMinutes`       | `30`               | Slot size and touch snapping interval                                                        |
| `hourHeight`                | `64`               | Density in logical pixels per elapsed hour                                                   |
| `scrollToTime`              | start hour         | Initial `HH:mm` scroll position after date/view changes                                      |
| `locale`                    | `en-US`            | Locale passed to `Intl.DateTimeFormat`                                                       |
| `dateFormat` / `timeFormat` | localized defaults | `Intl.DateTimeFormatOptions` overrides                                                       |
| `onViewChange`              | —                  | `(view: CalendarView) => void`; receives day/week control presses                            |
| `onEventPress`              | —                  | `(event: CalendarEvent<T>) => void`; receives the original event                             |
| `onSlotPress`               | —                  | `(slot: CalendarSlot) => void`; receives `{ start, end }` ISO instants with an exclusive end |
| `theme`                     | system light/dark  | Partial `CalendarTheme` override                                                             |
| `header`                    | built-in defaults  | Icons, labels, title renderer, and view-switcher visibility                                  |
| `styles`                    | built-in styles    | Named style overrides for the header, grid, gutter, and events                               |
| `renderEvent`               | built-in card      | Custom event content rendered inside the positioned card                                     |
| `renderHeader`              | built-in header    | Custom navigation and view header                                                            |
| `emptyState`                | `No events`        | Content shown when the visible range has no timed events                                     |

`style?: StyleProp<ViewStyle>` overrides the outer container after `styles.container`; `testID?: string` identifies that container in tests. `dateFormat` defaults to `{ weekday: 'short', day: 'numeric' }` and `timeFormat` to `{ hour: 'numeric', minute: '2-digit' }`. These format the day headers and time labels respectively; the navigation title has its own built-in format.

`startHour` and `endHour` must be integers with `0 <= startHour < endHour <= 24`. `firstDayOfWeek` must be an integer from `0` to `6`; `slotDurationMinutes` and `hourHeight` must be finite positive numbers. Invalid dates, timezones, clock times, or these configuration values throw errors.

Provide `onViewChange` and update `view` to make the built-in view switcher change views; otherwise, hide it with `header.showViewSwitcher: false`. Pressing the built-in title requests today's date.

Seven-day ranges contain the controlled date and align to `firstDayOfWeek`. One- and three-day week ranges start on `date`. Previous and next advance by the visible column count.

### Event Data and Exported Types

`CalendarEvent<T>` combines your custom object fields with `CalendarEventFields`:

| Field           | Type                | Meaning                                                                       |
| --------------- | ------------------- | ----------------------------------------------------------------------------- |
| `id`            | `string`            | Required, unique, non-empty event ID                                          |
| `title`         | `string`            | Required event title                                                          |
| `start` / `end` | `string`            | Required ISO timestamps with `Z` or an explicit offset; end must follow start |
| `color`         | `string` (optional) | Event background color, overriding `theme.eventBackground`                    |

The root exports `FullCalendar`, `lightTheme`, and `darkTheme`, plus the types `CalendarEvent`, `CalendarEventFields`, `CalendarView`, `VisibleDays`, `CalendarSlot`, `FullCalendarProps`, `CalendarTheme`, `CalendarStyles`, `CalendarHeaderConfig`, `EventRenderInfo`, and `HeaderRenderInfo`. Internal date and layout helpers are not part of the root API.

## Event and Timezone Rules

Event `start` and `end` must be ISO timestamps ending in `Z` or an explicit offset such as `+05:00`. Event ends are exclusive, so an event ending at 10:00 does not overlap one starting at 10:00. Invalid timestamps, duplicate or missing IDs, and non-positive ranges are skipped; development builds warn with the affected ID.

The package uses `temporal-polyfill` behind its date adapter. Calendar dates are interpreted in `timeZone`, while events remain exact instants. A missing local time during a spring-forward transition moves to the next valid instant. A repeated local time remains tied to the explicit offset in the event timestamp. Layout height uses actual elapsed time, so a range spanning a timezone transition can be shorter or longer than its wall-clock labels suggest. Local days are never assumed to last 24 hours.

Events intersecting the visible interval are included and clipped to its day and hour boundaries. Cross-midnight events render as separate visual segments. Pressing any segment returns the unchanged original event.

## Calendar Customization

A customizable React Native calendar can match your app through theme colors, named style slots, and render callbacks. To try this example, add the following optional props to the `FullCalendar<Appointment>` in `Schedule` above and import `Text` from `react-native`.

```tsx
<FullCalendar<Appointment>
  events={events}
  date={date}
  view={view}
  timeZone="Asia/Karachi"
  onDateChange={setDate}
  onViewChange={setView}
  theme={{ primary: '#4F46E5', gridLine: '#E5E7EB' }}
  header={{
    previousIcon: '←',
    nextIcon: '→',
    dayLabel: 'Daily',
    weekLabel: 'Schedule',
  }}
  styles={{
    header: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20 },
    dayHeader: { minHeight: 56 },
    event: { borderRadius: 10, padding: 6 },
    eventText: { fontSize: 13 },
  }}
  renderEvent={({ event, startsBefore, endsAfter }) => (
    <Text style={{ color: '#FFFFFF' }}>
      {event.title}
      {startsBefore || endsAfter ? ' (continued)' : ''}
    </Text>
  )}
/>
```

Set `header.showViewSwitcher` to `false` to hide the built-in day/week
switcher, or use `header.renderTitle` to replace only the title. Use
`renderHeader` when the whole header should be replaced. The `styles` prop
supports container, header, navigation, view-button, day-header, time-gutter,
day-column, event, and empty-state style slots; `theme` remains the simplest
way to change calendar colors.

`theme` accepts any subset of these color keys: `background`, `surface`, `text`, `secondaryText`, `gridLine`, `primary`, `primaryText`, `todayBackground`, `nowIndicator`, `eventBackground`, and `eventText`. Unspecified keys come from the system light/dark theme. Pass the exported `lightTheme` or `darkTheme` to keep a fixed palette.

`renderEvent` receives `{ event, startsBefore, endsAfter }` and returns a React element or `null`. The continuation flags describe clipping at the visible day/hour boundaries. The surrounding card still provides positioning and press handling; `styles.eventText` applies only to the built-in text.

`renderHeader` receives `{ label, previous, next, today, view, setView }` and returns a React element or `null`. Its actions request changes through the controlled callbacks. `header.renderTitle` receives the same information but returns any React node inside the built-in today button. Header icons accept React nodes; `previousAccessibilityLabel`, `nextAccessibilityLabel`, and `todayAccessibilityLabel` customize navigation labels.

See the complete style keys in [src/types.ts](./src/types.ts), the [Expo example](./example/src/App.tsx), and the [React Native CLI example and setup](./example-cli/README.md).

Built-in events expose useful screen-reader labels, text scaling limits, and button roles. Headers and day columns mirror when React Native's RTL setting is enabled. Custom renderers are responsible for the accessibility of their own content, while the surrounding event button retains its generated label.

## Release channels

An unqualified install selects npm's `latest` tag. The repository configures separate `beta` and `dev` publishing workflows; these prerelease jobs do not replace `latest`. The commands below select those tags when available in the registry.

```sh
# Stable (the default release)
npm install @mujtababhatti2/react-native-full-calendar

# Latest beta
npm install @mujtababhatti2/react-native-full-calendar@beta

# Latest development build
npm install @mujtababhatti2/react-native-full-calendar@dev
```

Every push to `main` publishes a unique `-dev.<run-id>` version under the `dev`
tag after CI passes. To publish a beta, set `package.json` to a version ending in
`-beta.<number>` and push the matching `v<version>` Git tag. Published versions
remain installable by their exact version and visible in npm's Versions list,
even after the `beta` or `dev` tag advances.

Both prerelease jobs publish with an explicit npm dist-tag. Stable releases must
be published separately with the `latest` tag.

## Current Limitations

This release supports timed day and week views on Android and iOS. Month, agenda, all-day rows, drag and resize, swipe navigation, recurring-event expansion, resources, availability overlays, booking rules, and React Native Web are not implemented in the current source. Expand recurring occurrences into individual timed events in your app before passing them to the calendar.

## License

MIT
