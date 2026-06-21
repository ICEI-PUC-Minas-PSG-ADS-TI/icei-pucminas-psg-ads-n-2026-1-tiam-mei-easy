import { Alert, Platform } from 'react-native';

export function showAlert(titulo, mensagem, aoFechar) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    if (aoFechar) aoFechar();
    return;
  }
  Alert.alert(
    titulo,
    mensagem,
    aoFechar ? [{ text: 'OK', onPress: aoFechar }] : undefined
  );
}

export function showConfirm(titulo, mensagem) {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      resolve(window.confirm(`${titulo}\n\n${mensagem}`));
      return;
    }
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
