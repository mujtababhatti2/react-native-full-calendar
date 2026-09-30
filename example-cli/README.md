# React Native CLI example

This bare React Native 0.86 app verifies that the calendar works without Expo. It is part of the repository workspace and resolves the library directly from `src` through Metro.

From the repository root, install dependencies and start Metro:

```sh
corepack yarn install
corepack yarn example:cli start
```

In another terminal, run Android:

```sh
corepack yarn example:cli android
```

For iOS, install pods first and then run the app:

```sh
cd example-cli/ios
bundle install
bundle exec pod install
cd ../..
corepack yarn example:cli ios
```

The standard React Native CLI environment setup is required: Android Studio and an Android SDK for Android, or Xcode and CocoaPods for iOS.
