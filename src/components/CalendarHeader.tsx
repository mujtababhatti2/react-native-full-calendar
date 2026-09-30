import { Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  CalendarHeaderConfig,
  CalendarStyles,
  CalendarTheme,
  CalendarView,
  HeaderRenderInfo,
} from '../types';

type Props = HeaderRenderInfo & {
  theme: CalendarTheme;
  config?: CalendarHeaderConfig;
  calendarStyles?: CalendarStyles;
  renderHeader?: (info: HeaderRenderInfo) => React.ReactElement | null;
};

export function CalendarHeader(props: Props) {
  const {
    theme,
    config = {},
    calendarStyles = {},
    renderHeader,
    ...info
  } = props;
  if (renderHeader) return renderHeader(info);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface },
        calendarStyles.header,
      ]}
    >
      <View style={[styles.navigation, calendarStyles.headerNavigation]}>
        <HeaderButton
          content={config.previousIcon ?? '‹'}
          onPress={info.previous}
          theme={theme}
          calendarStyles={calendarStyles}
          label={config.previousAccessibilityLabel ?? 'Previous'}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={config.todayAccessibilityLabel ?? 'Go to today'}
          onPress={info.today}
          style={[styles.labelButton, calendarStyles.headerTitleButton]}
        >
          {config.renderTitle ? (
            config.renderTitle(info)
          ) : (
            <Text
              maxFontSizeMultiplier={1.5}
              style={[
                styles.label,
                { color: theme.text },
                calendarStyles.headerTitle,
              ]}
            >
              {info.label}
            </Text>
          )}
        </Pressable>
        <HeaderButton
          label={config.nextAccessibilityLabel ?? 'Next'}
          content={config.nextIcon ?? '›'}
          onPress={info.next}
          theme={theme}
          calendarStyles={calendarStyles}
        />
      </View>
      {config.showViewSwitcher !== false ? (
        <View
          style={[styles.switcher, calendarStyles.viewSwitcher]}
          accessibilityRole="tablist"
        >
          {(['day', 'week'] as CalendarView[]).map((view) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: info.view === view }}
              key={view}
              onPress={() => info.setView(view)}
              style={[
                styles.tab,
                info.view === view && { backgroundColor: theme.primary },
                calendarStyles.viewButton,
                info.view === view && calendarStyles.selectedViewButton,
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.5}
                style={[
                  styles.tabText,
                  {
                    color:
                      info.view === view
                        ? theme.primaryText
                        : theme.secondaryText,
                  },
                  calendarStyles.viewButtonText,
                  info.view === view && calendarStyles.selectedViewButtonText,
                ]}
              >
                {view === 'day'
                  ? (config.dayLabel ?? 'Day')
                  : (config.weekLabel ?? 'Week')}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function HeaderButton({
  label,
  content,
  onPress,
  theme,
  calendarStyles,
}: {
  label: string;
  content: React.ReactNode;
  onPress: () => void;
  theme: CalendarTheme;
  calendarStyles: CalendarStyles;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={[styles.iconButton, calendarStyles.headerButton]}
    >
      {typeof content === 'string' || typeof content === 'number' ? (
        <Text
          maxFontSizeMultiplier={1.5}
          style={[
            styles.icon,
            { color: theme.primary },
            calendarStyles.headerButtonText,
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, paddingVertical: 8 },
  navigation: { alignItems: 'center', flexDirection: 'row' },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  icon: { fontSize: 32, lineHeight: 36 },
  labelButton: {
    alignItems: 'center',
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  label: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  switcher: { alignSelf: 'center', flexDirection: 'row', marginTop: 4 },
  tab: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
  },
  tabText: { fontWeight: '600' },
});
