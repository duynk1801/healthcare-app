/**
 * Healthcare App — Design Tokens (Spacing & Layout)
 *
 * Based on 8px grid system + Figma HIG guidelines.
 * Border radius: 16px (Figma standard).
 */

/** Base unit: 4px — all spacing derived from this */
const BASE = 4;

/** Spacing scale (used for padding, margin, gap) */
export const spacing = {
  /** 0px */
  none: 0,
  /** 2px — hairline borders */
  xxs: BASE * 0.5,
  /** 4px — tight spacing */
  xs: BASE,
  /** 8px — compact spacing */
  sm: BASE * 2,
  /** 12px — default inline */
  md: BASE * 3,
  /** 16px — default section */
  lg: BASE * 4,
  /** 20px — group spacing */
  xl: BASE * 5,
  /** 24px — card padding */
  '2xl': BASE * 6,
  /** 32px — section spacing */
  '3xl': BASE * 8,
  /** 40px — large section */
  '4xl': BASE * 10,
  /** 48px — hero spacing */
  '5xl': BASE * 12,
} as const;

/** Border radius scale — Figma: 16px rounded corners */
export const radius = {
  /** 0px */
  none: 0,
  /** 4px — subtle rounding */
  xs: 4,
  /** 8px — small elements (badges, chips) */
  sm: 8,
  /** 12px — medium elements (inputs, buttons) */
  md: 12,
  /** 16px — Figma default (cards) */
  lg: 16,
  /** 20px — prominent elements */
  xl: 20,
  /** 24px — large cards */
  '2xl': 24,
  /** 9999px — pill/circle */
  full: 9999,
} as const;

/** Typography scale — Accessible Large Fonts (Figma) */
export const fontSize = {
  /** 11px — caption/footnote */
  xs: 11,
  /** 13px — secondary text */
  sm: 13,
  /** 15px — body text */
  md: 15,
  /** 17px — emphasized body */
  lg: 17,
  /** 20px — section title */
  xl: 20,
  /** 24px — screen title */
  '2xl': 24,
  /** 28px — hero number */
  '3xl': 28,
  /** 34px — large hero */
  '4xl': 34,
} as const;

/** Font weights */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Line heights */
export const lineHeight = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 42,
} as const;

/** Z-index scale */
export const zIndex = {
  base: 0,
  card: 1,
  header: 10,
  overlay: 50,
  modal: 100,
  toast: 200,
} as const;

/** Shadow presets */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
