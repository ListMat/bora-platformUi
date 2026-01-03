import { Platform } from 'react-native';

// Provider do mapa (Google Maps no Android, Apple Maps no iOS)
export const MAP_PROVIDER = Platform.select({
  ios: undefined, // Apple Maps (nativo)
  android: 'google', // Google Maps
  default: 'google',
}) as 'google' | undefined;
