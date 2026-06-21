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
import { useAuth } from '../../context/AuthContext';
import { showConfirm } from '../../utils/alerts';
import ScreenHeader from '../../components/ScreenHeader';
import { ChipGroup } from '../../components/FilterChip';
import Colors from '../../constants/colors';

export default function ListaCategoriasScreen({ navigation }) {
  const { userId } = useAuth();
  const [tipoAba, setTipoAba] = useState('receita');
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [tipoAba, userId])
  );

  async function carregar() {
    setCarregando(true);
    try {
      const lista = await getCategorias(userId, tipoAba);
      setCategorias(lista);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarExclusao(item) {
    const confirmado = await showConfirm(
      'Excluir categoria',
      `Deseja excluir "${item.descricao || 'esta categoria'}"?`
    );
    if (!confirmado) return;

    try {
      const emUso = await categoriaEmUso(userId, item.id);
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
      <ScreenHeader />

      <Text style={styles.subtitulo}>Categorias</Text>

      <View style={styles.chipsArea}>
        <ChipGroup
        horizontal={false}
        options={[
          { label: 'Receitas', value: 'receita' },
          { label: 'Despesas', value: 'despesa' },
        ]}
        value={tipoAba}
        onChange={setTipoAba}
      />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  subtitulo: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chipsArea: { paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  lista: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface,
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
  iconeTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: Colors.white, fontSize: 15, fontWeight: '600', flex: 1 },
  acoesRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { padding: 4 },
  btnExcluir: { padding: 4 },
  btnAcaoTexto: { fontSize: 16 },
  semDados: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.primaryMedium,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnNovaTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
