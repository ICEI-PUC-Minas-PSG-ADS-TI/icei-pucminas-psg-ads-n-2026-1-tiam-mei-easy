import { Alert, Platform } from 'react-native';

export function showAlert(title, message, buttons, options) {
  if (Platform.OS === 'web') {
    const text = title ? `${title}\n\n${message}` : message;
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(text);
    }
    return;
  }

  Alert.alert(title, message, buttons, options);
}
