import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { isFirebaseConfigValid } from './config/firebaseConfig';

function ConfigErrorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configuração incompleta</Text>
      <Text style={styles.texto}>
        Copie o arquivo .env.example para .env em src/app e preencha as variáveis
        EXPO_PUBLIC_FIREBASE_* com os dados do Firebase Console.
      </Text>
    </View>
  );
}

export default function App() {
  if (!isFirebaseConfigValid()) {
    return <ConfigErrorScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a2a5e',
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  texto: {
    color: '#aac',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
