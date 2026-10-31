import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/theme/useTheme';

/** Full-bleed background: the base color lit by a few soft, diffuse light sources. */
export function Atmosphere() {
  const { palette } = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.base }]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          {palette.lights.map((light, i) => (
            <RadialGradient key={i} id={`light-${i}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={light.color} stopOpacity={light.opacity} />
              <Stop offset="1" stopColor={light.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {palette.lights.map((light, i) => (
          <Ellipse
            key={i}
            cx={light.cx}
            cy={light.cy}
            rx={light.rx}
            ry={light.ry}
            fill={`url(#light-${i})`}
          />
        ))}
      </Svg>
    </View>
  );
}
