import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/colors';

export default function ScreenHeader({ onBack, rightElement, showBack = true }) {
  const navigation = useNavigation();

  function voltar() {
    if (onBack) {
      onBack();
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
  }

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={voltar} style={styles.side}>
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={styles.headerTitulo}>
        MEI <Text style={styles.headerDestaque}>EASY</Text>
      </Text>
      <View style={styles.side}>{rightElement || null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  side: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltarTexto: {
    color: Colors.white,
    fontSize: 22,
  },
  headerTitulo: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerDestaque: {
    color: Colors.accent,
  },
});
