/**
 * Theme exports
 * Centraliza todas as exportações do tema
 */

export * from './tokens';

// Helper para criar styles com tokens
import { tokens } from './tokens';

export const theme = tokens;

// Helper functions
export const getColor = (path: string) => {
  const parts = path.split('.');
  let value: any = tokens.colors;
  for (const part of parts) {
    value = value?.[part];
  }
  return value || '#000000';
};

export const getSpacing = (key: keyof typeof tokens.spacing) => {
  return tokens.spacing[key];
};

export const getRadius = (key: keyof typeof tokens.radius) => {
  return tokens.radius[key];
};

