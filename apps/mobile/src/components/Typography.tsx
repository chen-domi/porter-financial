import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { splitCents } from '@/lib/money';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type TextProps = { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean };

/** Editorial serif for greetings, screen titles and moments. */
export function Display({ children, style, size = 34 }: TextProps & { size?: number }) {
  const { palette } = useTheme();
  return (
    <Text
      style={[
        { fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.05, color: palette.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Body({
  children,
  style,
  muted,
  weight = 'regular',
}: TextProps & { weight?: 'regular' | 'medium' }) {
  const { palette } = useTheme();
  return (
    <Text
      style={[
        {
          fontFamily: weight === 'medium' ? fonts.medium : fonts.regular,
          fontSize: 15,
          lineHeight: 21,
          color: muted ? palette.textMuted : palette.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Small caps, tracked out. */
export function Label({ children, style }: TextProps) {
  const { palette } = useTheme();
  return (
    <Text
      style={[
        {
          fontFamily: fonts.medium,
          fontSize: 11,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: palette.textMuted,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Thin hero number with cents set as a muted superscript. Null renders an em dash. */
export function Money({ cents, size = 44 }: { cents: number | null; size?: number }) {
  const { palette } = useTheme();
  const base: TextStyle = {
    fontFamily: fonts.light,
    fontSize: size,
    lineHeight: size * 1.1,
    letterSpacing: -size * 0.045,
    color: palette.text,
    fontVariant: ['tabular-nums'],
  };
  if (cents === null) {
    return <Text style={[base, { color: palette.textMuted }]}>—</Text>;
  }
  const parts = splitCents(cents);
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'flex-start' }}
      accessible
      accessibilityLabel={`${parts.whole}.${parts.cents}`}
    >
      <Text style={base}>{parts.whole}</Text>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: size * 0.42,
          marginTop: size * 0.12,
          marginLeft: 1,
          color: palette.textMuted,
          fontVariant: ['tabular-nums'],
        }}
      >
        .{parts.cents}
      </Text>
    </View>
  );
}
