import { useColorScheme } from 'react-native';

import { dark, light, type Palette } from './tokens';

export function useTheme(): { palette: Palette; scheme: 'dark' | 'light' } {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  return { palette: scheme === 'light' ? light : dark, scheme };
}
