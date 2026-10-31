import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Glass } from './Glass';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = { label: string; value: string | null; caption?: string; accessory?: ReactNode };

/** A small glass stat tile. A null value renders a quiet em dash. */
export function Tile({ label, value, caption, accessory }: Props) {
  const { palette } = useTheme();
  return (
    <Glass radius={radius.md} style={styles.tile}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: palette.textMuted }]}>{label}</Text>
          {accessory}
        </View>
        <View>
          <Text
            style={[styles.value, { color: value === null ? palette.textMuted : palette.text }]}
          >
            {value ?? '—'}
          </Text>
          {caption ? (
            <Text style={[styles.caption, { color: palette.textMuted }]}>{caption}</Text>
          ) : null}
        </View>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minHeight: 92 },
  inner: { flex: 1, padding: space.md, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: fonts.regular, fontSize: 12 },
  value: { fontFamily: fonts.regular, fontSize: 21, letterSpacing: -0.6, marginTop: space.sm },
  caption: { fontFamily: fonts.regular, fontSize: 11, marginTop: 2 },
});
