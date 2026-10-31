/**
 * Porter design tokens: "Midnight & metal". See docs/prd.html §05.
 * Dark is the default; light mirrors it with paper and pale washes.
 */

export type Palette = {
  base: string;
  text: string;
  textMuted: string;
  glassFill: string;
  glassEdge: string;
  glassHighlight: string;
  hairline: string;
  controlActive: string;
  controlActiveText: string;
  champagne: string;
  steel: string;
  sage: string;
  ember: string;
  /** Large, low-opacity light sources that give the background its atmosphere. */
  lights: { color: string; opacity: number; cx: string; cy: string; rx: string; ry: string }[];
};

export const dark: Palette = {
  base: '#07090C',
  text: '#F2F1EE',
  textMuted: '#8B93A1',
  glassFill: 'rgba(255,255,255,0.055)',
  glassEdge: 'rgba(255,255,255,0.09)',
  glassHighlight: 'rgba(255,255,255,0.12)',
  hairline: 'rgba(255,255,255,0.08)',
  controlActive: 'rgba(255,255,255,0.10)',
  controlActiveText: '#F2F1EE',
  champagne: '#D6B97C',
  steel: '#9DB4D3',
  sage: '#7FD1A8',
  ember: '#E59A78',
  lights: [
    { color: '#4A6287', opacity: 0.55, cx: '30%', cy: '-8%', rx: '120%', ry: '55%' },
    { color: '#3C485C', opacity: 0.35, cx: '110%', cy: '72%', rx: '70%', ry: '35%' },
  ],
};

export const light: Palette = {
  base: '#FBFBF8',
  text: '#121316',
  textMuted: '#858893',
  glassFill: 'rgba(255,255,255,0.72)',
  glassEdge: 'rgba(18,19,22,0.06)',
  glassHighlight: 'rgba(255,255,255,0.9)',
  hairline: 'rgba(18,19,22,0.06)',
  controlActive: '#121316',
  controlActiveText: '#FFFFFF',
  champagne: '#A9853F',
  steel: '#4F6E95',
  sage: '#2F7D57',
  ember: '#B4552F',
  lights: [
    { color: '#EAF1D8', opacity: 1, cx: '10%', cy: '-5%', rx: '90%', ry: '45%' },
    { color: '#DFE8F5', opacity: 1, cx: '105%', cy: '8%', rx: '70%', ry: '40%' },
  ],
};

export const fonts = {
  display: 'InstrumentSerif_400Regular',
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 18, xl: 24, xxl: 36 } as const;

export const radius = { sm: 10, md: 16, lg: 18, xl: 26, pill: 999 } as const;
