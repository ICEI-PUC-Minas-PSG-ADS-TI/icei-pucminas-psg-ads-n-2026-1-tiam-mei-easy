import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMovimentacoes, excluirMovimentacao } from '../../services/movimentacoesService';
import { useAuth } from '../../context/AuthContext';
import { formatarMoedaExibicao, formatarDataBR } from '../../utils/formatacao';
import { showConfirm } from '../../utils/alerts';
import ScreenHeader from '../../components/ScreenHeader';
import { ChipGroup } from '../../components/FilterChip';
import Colors from '../../constants/colors';

export default function ListaMovimentacoesScreen({ navigation }) {
  const { userId } = useAuth();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState(''); // '' | 'receita' | 'despesa'
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Recarrega sempre que a tela entrar em foco (após salvar nova movimentação)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [filtroTipo, filtroDataInicio, filtroDataFim, userId])
  );

  async function carregar() {
    setCarregando(true);
    try {
      const filtros = {
        tipo: filtroTipo || undefined,
        dataInicio: filtroDataInicio || undefined,
        dataFim: filtroDataFim || undefined,
      };
      const lista = await getMovimentacoes(userId, filtros);
      setMovimentacoes(lista);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as movimentações.');
    } finally {
      setCarregando(false);
    }
  }

async function confirmarExclusao(item) {
  const confirmado = await showConfirm(
    'Excluir movimentação',
    `Deseja excluir "${item.descricao || 'esta movimentação'}"?`
  );
  if (!confirmado) return;

  try {
    await excluirMovimentacao(item.id);
    carregar();
  } catch {
    Alert.alert('Erro', 'Não foi possível excluir.');
  }
}

  function formatarValor(valor) {
    return formatarMoedaExibicao(valor);
  }

  function formatarData(data) {
    return formatarDataBR(data);
  }

  const totalReceitas = movimentacoes
    .filter((m) => m.tipo === 'receita')
    .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0);

  const totalDespesas = movimentacoes
    .filter((m) => m.tipo === 'despesa')
    .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0);

  function renderItem({ item }) {
    const isReceita = item.tipo === 'receita';
    return (
      <View style={styles.card}>
        <View style={styles.cardEsquerda}>
          <View style={[styles.icone, { backgroundColor: isReceita ? '#27ae60' : '#e74c3c' }]}>
            <Text style={styles.iconeTexto}>{isReceita ? '↑' : '↓'}</Text>
          </View>
          <View>
            <Text style={styles.cardDescricao}>{item.descricao || (isReceita ? 'Receita' : 'Despesa')}</Text>
            <Text style={styles.cardCategoria}>{item.categoria?.descricao || 'Sem categoria'}</Text>
            <Text style={styles.cardData}>{formatarData(item.data)}</Text>
          </View>
        </View>
        <View style={styles.cardDireita}>
          <Text style={[styles.cardValor, { color: isReceita ? '#4fc3f7' : '#ff6b6b' }]}>
            {isReceita ? '+' : '-'}{formatarValor(item.valor)}
          </Text>
          <View style={styles.acoesRow}>
            <TouchableOpacity
              style={styles.btnEditar}
              onPress={() => navigation.navigate('NovaMovimentacao', { movimentacao: item })}
            >
              <Text style={styles.btnAcaoTexto}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnExcluir} onPress={() => confirmarExclusao(item)}>
              <Text style={styles.btnAcaoTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        rightElement={
          <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)}>
            <Text style={styles.filtroIcone}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      {/* Resumo */}
      <View style={styles.resumoRow}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Entradas</Text>
          <Text style={[styles.resumoValor, { color: '#4fc3f7' }]}>R$ {totalReceitas.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Saídas</Text>
          <Text style={[styles.resumoValor, { color: '#ff6b6b' }]}>R$ {totalDespesas.toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>

      {/* Filtros */}
      {mostrarFiltros && (
        <View style={styles.filtrosBox}>
          <Text style={styles.filtrosTitulo}>Filtros</Text>

          <ChipGroup
            horizontal={false}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Entradas', value: 'receita' },
              { label: 'Saídas', value: 'despesa' },
            ]}
            value={filtroTipo}
            onChange={setFiltroTipo}
          />

          {/* Período */}
          <View style={styles.filtroDataRow}>
            <TextInput
              style={[styles.inputData, { marginRight: 8 }]}
              placeholder="De: AAAA-MM-DD"
              placeholderTextColor="#aac"
              value={filtroDataInicio}
              onChangeText={setFiltroDataInicio}
            />
            <TextInput
              style={styles.inputData}
              placeholder="Até: AAAA-MM-DD"
              placeholderTextColor="#aac"
              value={filtroDataFim}
              onChangeText={setFiltroDataFim}
            />
          </View>

          <TouchableOpacity style={styles.btnAplicar} onPress={carregar}>
            <Text style={styles.btnAplicarTexto}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.semDados}>Nenhuma movimentação encontrada.</Text>
          }
        />
      )}

      {/* Botão Nova Movimentação */}
      <TouchableOpacity
        style={styles.btnNova}
        onPress={() => navigation.navigate('NovaMovimentacao')}
      >
        <Text style={styles.btnNovaTexto}>+ Nova Movimentação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  filtroIcone: { fontSize: 22 },
  resumoRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  resumoCard: {
    flex: 1, backgroundColor: Colors.primaryMedium, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  resumoLabel: { color: Colors.textSoft, fontSize: 12, marginBottom: 4 },
  resumoValor: { fontSize: 16, fontWeight: 'bold' },
  filtrosBox: {
    backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 12,
    padding: 16, marginBottom: 8,
  },
  filtrosTitulo: { color: Colors.white, fontWeight: 'bold', marginBottom: 10 },
  filtroDataRow: { flexDirection: 'row', marginBottom: 10 },
  inputData: {
    flex: 1, backgroundColor: Colors.primaryMedium, color: Colors.white,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 12,
  },
  btnAplicar: {
    backgroundColor: Colors.accent, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  btnAplicarTexto: { color: Colors.primary, fontWeight: 'bold' },
  lista: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  icone: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconeTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  cardCategoria: { color: Colors.textMuted, fontSize: 11 },
  cardData: { color: Colors.textMuted, fontSize: 11 },
  cardDireita: { alignItems: 'flex-end' },
  cardValor: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  acoesRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { padding: 4 },
  btnExcluir: { padding: 4 },
  btnAcaoTexto: { fontSize: 16 },
  semDados: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  btnNova: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    backgroundColor: Colors.primaryMedium, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  btnNovaTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});