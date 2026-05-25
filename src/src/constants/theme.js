/**
 * theme.js — Design tokens for MetalsLive
 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F8F7F4',
  surfaceSecondary: '#F1EFE8',
  border: 'rgba(0,0,0,0.1)',
  borderStrong: 'rgba(0,0,0,0.2)',

  text: '#1A1A18',
  textSecondary: '#5F5E5A',
  textTertiary: '#888780',

  gold: '#BA7517',
  goldLight: '#FAEEDA',
  goldAccent: '#EF9F27',

  silver: '#5F5E5A',
  silverLight: '#F1EFE8',
  silverAccent: '#B4B2A9',

  platinum: '#185FA5',
  platinumLight: '#E6F1FB',
  platinumAccent: '#378ADD',

  palladium: '#0F6E56',
  palladiumLight: '#E1F5EE',
  palladiumAccent: '#1D9E75',

  positive: '#3B6D11',
  positiveBg: '#EAF3DE',
  negative: '#A32D2D',
  negativeBg: '#FCEBEB',

  error: '#791F1F',
  errorBg: '#FCEBEB',
  errorBorder: '#F09595',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const typography = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 40,
};

// Per-metal theme tokens — keyed by metal id
export const metalTheme = {
  gold: {
    primary: colors.gold,
    light: colors.goldLight,
    accent: colors.goldAccent,
  },
  silver: {
    primary: colors.silver,
    light: colors.silverLight,
    accent: colors.silverAccent,
  },
  platinum: {
    primary: colors.platinum,
    light: colors.platinumLight,
    accent: colors.platinumAccent,
  },
  palladium: {
    primary: colors.palladium,
    light: colors.palladiumLight,
    accent: colors.palladiumAccent,
  },
};
