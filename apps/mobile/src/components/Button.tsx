import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { fonts, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

/** Solid, flat, high-contrast. Never a gradient. */
export function Button({ title, onPress, disabled, loading }: Props) {
  const { palette } = useTheme();
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => ({
        height: 52,
        borderRadius: radius.pill,
        backgroundColor: palette.text,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inactive ? 0.4 : pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      {loading ? (
        <ActivityIndicator color={palette.base} />
      ) : (
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: palette.base }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
