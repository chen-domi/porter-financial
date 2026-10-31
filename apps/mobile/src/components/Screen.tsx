import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Atmosphere } from './Atmosphere';
import { space } from '@/theme/tokens';

/** Standard screen: atmospheric background, safe-area padding, room for the floating tab bar. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + space.md,
    paddingBottom: insets.bottom + 96,
    paddingHorizontal: space.lg,
  };
  return (
    <View style={styles.root}>
      <Atmosphere />
      {scroll ? (
        <ScrollView contentContainerStyle={padding} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.root, padding]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
