# Contributing

Install Node 20 and enable Corepack, then run:

```sh
corepack yarn install
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn build
```

Use `corepack yarn example:expo start` to open the Expo example. Use `corepack yarn example:cli start` with `android` or `ios` in a second terminal to test the bare React Native CLI app. Add unit tests for calendar calculations and component tests for public behavior. Keep timezone arithmetic in `src/core`; UI components should consume calculated instants and segments.

Bug reports should include the timezone, locale, calendar date, event timestamps with offsets, platform, and React Native version.
