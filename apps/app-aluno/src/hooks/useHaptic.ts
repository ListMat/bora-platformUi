import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptic() {
  const isWeb = Platform.OS === 'web';

  const light = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const medium = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const heavy = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const success = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const error = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const warning = () => {
    if (isWeb) return; // Haptics não funciona na web
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  return { light, medium, heavy, success, error, warning };
}

