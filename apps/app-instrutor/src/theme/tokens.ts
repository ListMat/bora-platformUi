/**
 * Design Tokens do Figma - Dark Mode
 * Gerado automaticamente a partir dos tokens do Figma
 */

// Cores
export const colors = {
  // Text
  text: {
    primary: '#F5F5F6',
    primaryOnBrand: '#F5F5F6',
    secondary: '#D1D5DB',
    secondaryHover: '#E5E7EB',
    secondaryOnBrand: '#D1D5DB',
    tertiary: '#9CA3AF',
    tertiaryHover: '#D1D5DB',
    tertiaryOnBrand: '#9CA3AF',
    quaternary: '#9CA3AF',
    quaternaryOnBrand: '#9CA3AF',
    white: '#FFFFFF',
    disabled: '#6B7280',
    placeholder: '#6B7280',
    placeholderSubtle: '#4B5563',
    brandPrimary: '#F5F5F6',
    brandSecondary: '#D1D5DB',
    brandTertiary: '#9CA3AF',
    brandTertiaryAlt: '#F5F5F6',
    error: '#F97066',
    warning: '#FDB022',
    success: '#47CD89',
  },

  // Background
  background: {
    primary: '#030712',
    primaryHover: '#1F2937',
    secondary: '#111827',
    secondaryHover: '#1F2937',
    secondarySubtle: '#111827',
    secondarySolid: '#4B5563',
    tertiary: '#1F2937',
    quaternary: '#4B5563',
    active: '#1F2937',
    disabled: '#1F2937',
    disabledSubtle: '#111827',
    overlay: '#1F2937',
    // Brand colors (BORA Orange)
    brandPrimary: '#FF6D00', // Laranja BORA
    brandSecondary: '#E85D00',
    brandSolid: '#FF6D00',
    brandSolidHover: '#FF8533',
    // Status colors
    error: '#F04438',
    errorSecondary: '#D92D20',
    errorSolid: '#D92D20',
    warning: '#F79009',
    warningSecondary: '#DC6803',
    warningSolid: '#DC6803',
    success: '#17B26A',
    successSecondary: '#079455',
    successSolid: '#079455',
  },

  // Foreground
  foreground: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    secondaryHover: '#E5E7EB',
    tertiary: '#9CA3AF',
    tertiaryHover: '#D1D5DB',
    quaternary: '#9CA3AF',
    quaternaryHover: '#D1D5DB',
    quinary: '#6B7280',
    quinaryHover: '#9CA3AF',
    senary: '#4B5563',
    white: '#FFFFFF',
    disabled: '#6B7280',
    disabledSubtle: '#4B5563',
  },

  // Border
  border: {
    primary: '#4B5563',
    secondary: '#1F2937',
    tertiary: '#1F2937',
    disabled: '#4B5563',
    disabledSubtle: '#1F2937',
    brand: '#FF6D00',
    brandSolid: '#FF6D00',
    brandSolidAlt: '#4B5563',
    error: '#F97066',
    errorSolid: '#F04438',
  },
} as const;

// Radius
export const radius = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  full: 9999,
} as const;

// Spacing
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 64,
  '8xl': 80,
  '9xl': 96,
  '10xl': 128,
  '11xl': 160,
} as const;

// Widths
export const widths = {
  xxs: 320,
  xs: 384,
  sm: 480,
  md: 560,
  lg: 640,
  xl: 768,
  '2xl': 1024,
  '3xl': 1280,
  '4xl': 1440,
  '5xl': 1600,
  '6xl': 1920,
  paragraphMax: 720,
} as const;

// Containers
export const containers = {
  paddingMobile: 16,
  paddingDesktop: 32,
  maxWidthDesktop: 1280,
} as const;

// Typography (valores padrão para React Native)
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Export all tokens
export const tokens = {
  colors,
  radius,
  spacing,
  widths,
  containers,
  typography,
} as const;

export type Colors = typeof colors;
export type Radius = typeof radius;
export type Spacing = typeof spacing;
export type Widths = typeof widths;
export type Containers = typeof containers;
export type Typography = typeof typography;

