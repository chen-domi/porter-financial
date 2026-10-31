import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = { color: string; size?: number };

const stroke = {
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

export function HomeIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 10.5L12 4l8 6.5V20h-5v-6H9v6H4z" stroke={color} {...stroke} />
    </Svg>
  );
}

export function CardIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={6} width={18} height={12} rx={2.5} stroke={color} {...stroke} />
      <Path d="M3 10h18" stroke={color} {...stroke} />
    </Svg>
  );
}

export function SpendingIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 20V12M12 20V5M18 20v-9" stroke={color} {...stroke} />
    </Svg>
  );
}

export function GiftIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 9h16v11H4zM2.5 6h19v3h-19zM12 6v14M12 6c-2-3-6-3-6 0M12 6c2-3 6-3 6 0"
        stroke={color}
        {...stroke}
      />
    </Svg>
  );
}

export function SparkleIcon({
  color,
  size = 20,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
        stroke={color}
        {...stroke}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function BellIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" stroke={color} {...stroke} />
      <Path d="M10 20.5a2 2 0 0 0 4 0" stroke={color} {...stroke} />
    </Svg>
  );
}

export function LockIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={5} y={10.5} width={14} height={10} rx={2.5} stroke={color} {...stroke} />
      <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke={color} {...stroke} />
      <Circle cx={12} cy={15.5} r={1.2} fill={color} />
    </Svg>
  );
}
