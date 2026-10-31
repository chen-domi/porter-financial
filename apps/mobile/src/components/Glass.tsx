import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius as radii } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
};

/** A frosted panel: blur, a translucent fill, and a 1px light edge. Depth without shadows. */
export function Glass({ children, style, radius = radii.lg, intensity = 30 }: Props) {
  const { palette, scheme } = useTheme();
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, style]}>
      <BlurView intensity={intensity} tint={scheme} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: palette.glassFill,
            borderRadius: radius,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: palette.glassEdge,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: radius,
          right: radius,
          height: StyleSheet.hairlineWidth,
          backgroundColor: palette.glassHighlight,
        }}
      />
      {children}
    </View>
  );
}
