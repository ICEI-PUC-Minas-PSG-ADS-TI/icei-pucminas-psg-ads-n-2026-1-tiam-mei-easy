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
  getCategorias,
  excluirCategoria,
  categoriaEmUso,
} from '../../services/categoriasService';

const USUARIO_ID = 'usuario_teste';

export default function ListaCategoriasScreen({ navigation }) {
  const [tipoAba, setTipoAba] = useState('receita');
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [tipoAba])
  );

  async function carregar() {
    setCarregando(true);
    try {
      const lista = await getCategorias(USUARIO_ID, tipoAba);
      setCategorias(lista);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
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
      'Excluir categoria',
      `Deseja excluir "${item.descricao || 'esta categoria'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const emUso = await categoriaEmUso(USUARIO_ID, item.id);
              if (emUso) {
                Alert.alert(
                  'Não é possível excluir',
                  'Existem movimentações vinculadas a esta categoria. Edite ou remova essas movimentações antes.'
                );
                return;
              }
              await excluirCategoria(item.id);
              carregar();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a categoria.');
            }
          },
        },
      ]
    );
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
          <Text style={styles.cardDescricao}>{item.descricao || 'Sem nome'}</Text>
        </View>
        <View style={styles.acoesRow}>
          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() =>
              navigation.navigate('FormularioCategoria', { categoria: item })
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
        <TouchableOpacity
          onPress={voltar}
          style={styles.btnVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>
        <View style={styles.btnHeaderDir} />
      </View>

      <Text style={styles.subtitulo}>Categorias</Text>

      <View style={styles.abaRow}>
        {['receita', 'despesa'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.aba, tipoAba === t && styles.abaAtiva]}
            onPress={() => setTipoAba(t)}
          >
            <Text style={[styles.abaTexto, tipoAba === t && styles.abaTextoAtivo]}>
              {t === 'receita' ? 'Receitas' : 'Despesas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {carregando ? (
        <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.semDados}>
              Nenhuma categoria de {tipoAba === 'receita' ? 'receita' : 'despesa'}. Use o
              botão Nova categoria abaixo.
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.btnNova}
        onPress={() =>
          navigation.navigate('FormularioCategoria', {
            tipoInicial: tipoAba,
          })
        }
      >
        <Text style={styles.btnNovaTexto}>+ Nova categoria</Text>
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
  abaRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  aba: {
    flex: 1,
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  abaAtiva: { borderColor: '#4fc3f7' },
  abaTexto: { color: '#aac', fontSize: 14, fontWeight: '600' },
  abaTextoAtivo: { color: BRANCO },
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
  cardEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: BRANCO, fontSize: 15, fontWeight: '600', flex: 1 },
  acoesRow: { flexDirection: 'row', gap: 8 },
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
  btnNovaTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
});
