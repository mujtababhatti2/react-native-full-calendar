# Android performance profile

Performance must be recorded before each beta on a physical lower-end Android device or an emulator configured with 2 CPU cores and 2 GB RAM. Use a release build; development timings include React diagnostics and are not comparable.

## Fixture

Profile a seven-day view containing 500 events: 60 events per weekday, 100 events spread across the weekend, at least 20 simultaneous events, 50 events shorter than 30 minutes, and 20 cross-midnight events. Use `hourHeight={64}`, a 30-minute slot, and a 24-hour visible range.

## Procedure

1. Record device model, Android version, React Native version, package version, and build mode.
2. Capture cold initial render from mounting `FullCalendar` until the UI thread is idle.
3. Navigate forward and backward ten times and record median update duration.
4. Scroll the full vertical range five times using a consistent gesture and record JS/UI FPS and dropped frames with React Native DevTools or Android Studio Profiler.
5. Repeat with one, three, and seven visible days and attach the profiler trace to the release notes.

## Results

No representative physical lower-end Android device is attached to this repository environment. The first beta must not be published until the table below is completed.

| Package | Device / OS | Columns | Initial render | Navigation median | JS/UI FPS | Dropped frames |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `0.1.0-beta.0` | Pending physical-device run | 1 / 3 / 7 | Pending | Pending | Pending | Pending |
