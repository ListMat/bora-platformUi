import { useColorScheme } from 'react-native';
import { colors as darkColors, spacing, radius, typography } from '@/theme/tokens';

// Light theme colors (inverted from dark)
const lightColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#E8E8E8',
    brandPrimary: darkColors.background.brandPrimary, // Keep brand color
    brandSecondary: darkColors.background.brandSecondary,
    success: darkColors.background.success,
    warning: darkColors.background.warning,
    error: darkColors.background.error,
    disabled: '#D1D1D1',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#8A8A8A',
    placeholder: '#B0B0B0',
    white: '#FFFFFF',
    black: '#000000',
    error: darkColors.text.error,
    success: darkColors.text.success,
    warning: darkColors.text.warning,
  },
  border: {
    primary: '#E0E0E0',
    secondary: '#F0F0F0',
    tertiary: '#F8F8F8',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    isDark,
  };
}

