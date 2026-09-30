import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CalendarTheme, CalendarView, HeaderRenderInfo } from '../types';

type Props = HeaderRenderInfo & {
  theme: CalendarTheme;
  renderHeader?: (info: HeaderRenderInfo) => React.ReactElement | null;
};

export function CalendarHeader(props: Props) {
  const { theme, renderHeader, ...info } = props;
  if (renderHeader) return renderHeader(info);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.navigation}>
        <HeaderButton
          label="Previous"
          text="‹"
          onPress={info.previous}
          theme={theme}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to today"
          onPress={info.today}
          style={styles.labelButton}
        >
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.label, { color: theme.text }]}
          >
            {info.label}
          </Text>
        </Pressable>
        <HeaderButton label="Next" text="›" onPress={info.next} theme={theme} />
      </View>
      <View style={styles.switcher} accessibilityRole="tablist">
        {(['day', 'week'] as CalendarView[]).map((view) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: info.view === view }}
            key={view}
            onPress={() => info.setView(view)}
            style={[
              styles.tab,
              info.view === view && { backgroundColor: theme.primary },
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
              ]}
            >
              {view === 'day' ? 'Day' : 'Week'}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function HeaderButton({
  label,
  text,
  onPress,
  theme,
}: {
  label: string;
  text: string;
  onPress: () => void;
  theme: CalendarTheme;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={styles.iconButton}
    >
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.icon, { color: theme.primary }]}
      >
        {text}
      </Text>
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
