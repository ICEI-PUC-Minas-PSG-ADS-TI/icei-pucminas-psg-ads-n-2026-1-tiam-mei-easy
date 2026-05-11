import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getRecorrencias,
  excluirRecorrencia,
} from '../../services/recorrenciasService';

const USUARIO_ID = 'usuario_teste';

export default function ListaRecorrenciasScreen({ navigation }) {
  const [recorrencias, setRecorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function carregar() {
    setCarregando(true);

    try {
      const lista = await getRecorrencias(USUARIO_ID);
      setRecorrencias(lista);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as recorrências.');
    } finally {
      setCarregando(false);
    }
  }

  function voltar() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }

  async function confirmarExclusao(item) {
    Alert.alert(
      'Excluir recorrência',
      `Deseja excluir "${item.descricao || 'esta recorrência'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirRecorrencia(item.id);
              carregar();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a recorrência.');
            }
          },
        },
      ]
    );
  }

  function formatarValor(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function renderItem({ item }) {
    const isReceita = item.tipo === 'receita';

    return (
      <View style={styles.card}>
        <View style={styles.cardEsquerda}>
          <View
            style={[
              styles.icone,
              { backgroundColor: isReceita ? '#27ae60' : '#e74c3c' },
            ]}
          >
            <Text style={styles.iconeTexto}>{isReceita ? '↑' : '↓'}</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardDescricao}>
              {item.descricao || 'Sem descrição'}
            </Text>

            <Text style={styles.cardDetalhe}>
              {formatarValor(item.valor)} • Dia {item.diaDoMes}
            </Text>

            <Text style={styles.cardStatus}>
              {item.ativo ? 'Ativa' : 'Inativa'}
            </Text>
          </View>
        </View>

        <View style={styles.acoesRow}>
          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() =>
              navigation.navigate('FormularioRecorrencia', {
                recorrencia: item,
              })
            }
          >
            <Text style={styles.btnAcaoTexto}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnExcluir}
            onPress={() => confirmarExclusao(item)}
          >
            <Text style={styles.btnAcaoTexto}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitulo} numberOfLines={1}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>

        <View style={styles.btnHeaderDir} />
      </View>

      <Text style={styles.subtitulo}>Recorrências</Text>

      {carregando ? (
        <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={recorrencias}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.semDados}>
              Nenhuma recorrência cadastrada. Use o botão abaixo para criar uma.
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.btnNova}
        onPress={() => navigation.navigate('FormularioRecorrencia')}
      >
        <Text style={styles.btnNovaTexto}>+ Nova recorrência</Text>
      </TouchableOpacity>
    </View>
  );
}

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AZUL_ESCURO },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },

  btnVoltar: { width: 36, paddingVertical: 4 },

  btnVoltarTexto: { color: BRANCO, fontSize: 22 },

  headerTitulo: {
    flex: 1,
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  headerDestaque: { color: '#4fc3f7' },

  btnHeaderDir: { width: 36 },

  subtitulo: {
    color: BRANCO,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  lista: { padding: 16, paddingBottom: 100 },

  card: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeTexto: {
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardInfo: {
    flex: 1,
  },

  cardDescricao: {
    color: BRANCO,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },

  cardDetalhe: {
    color: '#aac',
    fontSize: 13,
    marginTop: 4,
  },

  cardStatus: {
    color: '#4fc3f7',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },

  acoesRow: {
    flexDirection: 'row',
    gap: 8,
  },

  btnEditar: { padding: 4 },

  btnExcluir: { padding: 4 },

  btnAcaoTexto: { fontSize: 16 },

  semDados: {
    color: '#aac',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    paddingHorizontal: 8,
  },

  btnNova: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: AZUL_MEDIO,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  btnNovaTexto: {
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
  },
});