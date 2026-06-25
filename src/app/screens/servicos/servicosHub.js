import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';

export default function ServicosHub({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader />

      <Text style={styles.subtitulo}>Serviços</Text>

       <TouchableOpacity style={[styles.card, styles.cardDisabled]} disabled>
        <View style={styles.cardLeft}>
          <View style={[styles.icone, { backgroundColor: '#4fc3f7' }]}>
            <Text style={styles.iconeTexto}>📄</Text>
          </View>

          <View>
            <Text style={styles.cardTitulo}>Ordens de Serviço</Text>
            <Text style={styles.cardSub}>Em desenvolvimento</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListaServicos')}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.icone, { backgroundColor: '#27ae60' }]}>
            <Text style={styles.iconeTexto}>🛠️</Text>
          </View>

          <View>
            <Text style={styles.cardTitulo}>Serviços</Text>
            <Text style={styles.cardSub}>Cadastro de serviços e preços</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.cardDisabled]}
        disabled
      >
        <View style={styles.cardLeft}>
          <View style={[styles.icone, { backgroundColor: '#e67e22' }]}>
            <Text style={styles.iconeTexto}>📊</Text>
          </View>

          <View>
            <Text style={styles.cardTitulo}>Orçamentos</Text>
            <Text style={styles.cardSub}>Em desenvolvimento</Text>
          </View>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  subtitulo: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  cardDisabled: {
    opacity: 0.5,
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeTexto: {
    fontSize: 18,
  },

  cardTitulo: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },

  cardSub: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});