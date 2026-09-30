const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const root = path.resolve(__dirname, '..');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.useWatchman = false;

module.exports = withMetroConfig(defaultConfig, {
  root,
  dirname: __dirname,
  conditions: ['mujtababhatti2-react-native-full-calendar-source'],
});
