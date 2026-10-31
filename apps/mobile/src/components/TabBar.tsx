import type { BottomTabBarProps } from 'expo-router/tabs';
import * as Haptics from 'expo-haptics';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from './Glass';
import { CardIcon, GiftIcon, HomeIcon, SparkleIcon, SpendingIcon } from './icons';
import { radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const ICONS: Record<string, ComponentType<{ color: string; size?: number }>> = {
  index: HomeIcon,
  cards: CardIcon,
  spending: SpendingIcon,
  benefits: GiftIcon,
  ask: SparkleIcon,
};

/** Floating glass pill tab bar. */
export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.wrap, { bottom: Math.max(insets.bottom - 6, space.md) }]}
      pointerEvents="box-none"
    >
      <Glass radius={radius.xl} style={styles.bar}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const Icon = ICONS[route.name] ?? HomeIcon;
            const options = descriptors[route.key]?.options;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={options?.title ?? route.name}
                onPress={() => {
                  const event = emitter.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    void Haptics.selectionAsync();
                    navigateToTab(route.key);
                  }
                }}
                style={[styles.tab, focused && { backgroundColor: palette.controlActive }]}
              >
                <Icon color={focused ? palette.controlActiveText : palette.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.lg, right: space.lg },
  bar: { height: 58 },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  tab: { width: 48, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
