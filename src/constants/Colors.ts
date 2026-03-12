/**
 * Healthcare App — Design Tokens (Colors)
 *
 * Extracted from Figma Design System.
 * Single source of truth for all color values.
 *
 * Usage: import from Tamagui theme tokens, NOT from this file directly.
 * This file feeds into tamagui.config.ts.
 */

/** Primary brand colors — Blue gradient from Figma header */
export const palette = {
  // Primary Blue
  blue50: '#E6F4FE',
  blue100: '#BAE0FC',
  blue200: '#8ECCFA',
  blue300: '#5CB6F7',
  blue400: '#3AA5F5',
  blue500: '#2196F3', // Primary
  blue600: '#1E87E0',
  blue700: '#1A75C9',
  blue800: '#1664B3',
  blue900: '#0E4A8F',

  // Green (Success / Available)
  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green200: '#A5D6A7',
  green300: '#81C784',
  green400: '#66BB6A',
  green500: '#4CAF50', // Primary Green
  green600: '#43A047',
  green700: '#388E3C',
  green800: '#2E7D32',
  green900: '#1B5E20',

  // Teal (Telemedicine gradient)
  teal50: '#E0F2F1',
  teal100: '#B2DFDB',
  teal200: '#80CBC4',
  teal300: '#4DB6AC',
  teal400: '#26A69A',
  teal500: '#009688', // Telemedicine accent
  teal600: '#00897B',
  teal700: '#00796B',
  teal800: '#00695C',
  teal900: '#004D40',

  // Red (Error / End Call)
  red50: '#FFEBEE',
  red100: '#FFCDD2',
  red200: '#EF9A9A',
  red300: '#E57373',
  red400: '#EF5350',
  red500: '#F44336', // Error / End Call
  red600: '#E53935',
  red700: '#D32F2F',
  red800: '#C62828',
  red900: '#B71C1C',

  // Orange (Warning / Wellness cards)
  orange50: '#FFF3E0',
  orange100: '#FFE0B2',
  orange200: '#FFCC80',
  orange300: '#FFB74D',
  orange400: '#FFA726',
  orange500: '#FF9800',
  orange600: '#FB8C00',
  orange700: '#F57C00',
  orange800: '#EF6C00',
  orange900: '#E65100',

  // Purple (PiP local video)
  purple50: '#F3E5F5',
  purple100: '#E1BEE7',
  purple200: '#CE93D8',
  purple300: '#BA68C8',
  purple400: '#AB47BC',
  purple500: '#9C27B0',
  purple600: '#8E24AA',
  purple700: '#7B1FA2',
  purple800: '#6A1B9A',
  purple900: '#4A148C',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  black: '#000000',
} as const;

/** Semantic color tokens — mapped from palette */
export const semanticColors = {
  light: {
    // Backgrounds
    background: palette.white,
    backgroundSecondary: palette.gray50,
    backgroundCard: palette.white,

    // Text
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,
    textInverse: palette.white,

    // Brand
    primary: palette.blue500,
    primaryLight: palette.blue50,
    primaryDark: palette.blue800,

    // Status
    success: palette.green500,
    successLight: palette.green50,
    warning: palette.orange500,
    warningLight: palette.orange50,
    error: palette.red500,
    errorLight: palette.red50,
    info: palette.blue400,
    infoLight: palette.blue50,

    // Feature-specific
    telemedicineAccent: palette.teal500,
    wellnessOrange: palette.orange500,
    wellnessBlue: palette.blue400,
    pipPurple: palette.purple500,
    onlineGreen: palette.green500,

    // UI
    border: palette.gray200,
    borderFocus: palette.blue500,
    divider: palette.gray200,
    tabBarActive: palette.blue500,
    tabBarInactive: palette.gray400,
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    background: palette.gray900,
    backgroundSecondary: palette.gray800,
    backgroundCard: palette.gray800,

    textPrimary: palette.white,
    textSecondary: palette.gray400,
    textTertiary: palette.gray600,
    textInverse: palette.gray900,

    primary: palette.blue400,
    primaryLight: palette.blue900,
    primaryDark: palette.blue300,

    success: palette.green400,
    successLight: palette.green900,
    warning: palette.orange400,
    warningLight: palette.orange900,
    error: palette.red400,
    errorLight: palette.red900,
    info: palette.blue300,
    infoLight: palette.blue900,

    telemedicineAccent: palette.teal400,
    wellnessOrange: palette.orange400,
    wellnessBlue: palette.blue300,
    pipPurple: palette.purple400,
    onlineGreen: palette.green400,

    border: palette.gray700,
    borderFocus: palette.blue400,
    divider: palette.gray700,
    tabBarActive: palette.blue400,
    tabBarInactive: palette.gray600,
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;
