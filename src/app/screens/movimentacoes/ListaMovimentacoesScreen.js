import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { showAlert } from '../../utils/alert';
import { useFocusEffect } from '@react-navigation/native';
import { getMovimentacoes, excluirMovimentacao } from '../../services/movimentacoesService';
const USUARIO_ID = 'usuario_teste';

export default function ListaMovimentacoesScreen({ navigation }) {
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
    }, [filtroTipo, filtroDataInicio, filtroDataFim])
  );

  async function carregar() {
    setCarregando(true);
    try {
      const filtros = {
        tipo: filtroTipo || undefined,
        dataInicio: filtroDataInicio || undefined,
        dataFim: filtroDataFim || undefined,
      };
      const lista = await getMovimentacoes(USUARIO_ID, filtros);
      setMovimentacoes(lista);
    } catch (e) {
      showAlert('Erro', 'Não foi possível carregar as movimentações.');
    } finally {
      setCarregando(false);
    }
  }

function confirmarExclusao(item) {
  if (Platform.OS === 'web') {
    const confirmado = window.confirm(`Deseja excluir "${item.descricao || 'esta movimentação'}"?`);
    if (confirmado) {
      excluirMovimentacao(item.id)
        .then(() => carregar())
        .catch(() => showAlert('Erro', 'Não foi possível excluir.'));
    }
    return;
  }

  Alert.alert(
    'Excluir movimentação',
    `Deseja excluir "${item.descricao || 'esta movimentação'}"?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            await excluirMovimentacao(item.id);
            carregar();
          } catch {
            showAlert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]
  );
}

  function formatarValor(valor) {
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
  }

  function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
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

  function voltar() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.btnVoltar} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>
        <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={styles.btnHeaderDir}>
          <Text style={styles.filtroIcone}>⚙️</Text>
        </TouchableOpacity>
      </View>

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

          {/* Tipo */}
          <View style={styles.filtroTipoRow}>
            {['', 'receita', 'despesa'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.btnFiltroTipo, filtroTipo === t && styles.btnFiltroTipoAtivo]}
                onPress={() => setFiltroTipo(t)}
              >
                <Text style={styles.btnFiltroTipoTexto}>
                  {t === '' ? 'Todos' : t === 'receita' ? 'Entradas' : 'Saídas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AZUL_ESCURO },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
  },
  btnVoltar: { width: 36, paddingVertical: 4 },
  btnVoltarTexto: { color: BRANCO, fontSize: 22 },
  headerTitulo: { flex: 1, color: BRANCO, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  headerDestaque: { color: '#4fc3f7' },
  btnHeaderDir: { width: 36, alignItems: 'flex-end' },
  filtroIcone: { fontSize: 22 },
  resumoRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  resumoCard: {
    flex: 1, backgroundColor: AZUL_MEDIO, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  resumoLabel: { color: '#cce', fontSize: 12, marginBottom: 4 },
  resumoValor: { fontSize: 16, fontWeight: 'bold' },
  filtrosBox: {
    backgroundColor: '#243570', marginHorizontal: 16, borderRadius: 12,
    padding: 16, marginBottom: 8,
  },
  filtrosTitulo: { color: BRANCO, fontWeight: 'bold', marginBottom: 10 },
  filtroTipoRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  btnFiltroTipo: {
    flex: 1, backgroundColor: AZUL_MEDIO, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  btnFiltroTipoAtivo: { borderColor: '#4fc3f7' },
  btnFiltroTipoTexto: { color: BRANCO, fontSize: 12, fontWeight: '600' },
  filtroDataRow: { flexDirection: 'row', marginBottom: 10 },
  inputData: {
    flex: 1, backgroundColor: AZUL_MEDIO, color: BRANCO,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 12,
  },
  btnAplicar: {
    backgroundColor: '#4fc3f7', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  btnAplicarTexto: { color: AZUL_ESCURO, fontWeight: 'bold' },
  lista: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#243570', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  icone: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconeTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: BRANCO, fontSize: 14, fontWeight: '600' },
  cardCategoria: { color: '#aac', fontSize: 11 },
  cardData: { color: '#aac', fontSize: 11 },
  cardDireita: { alignItems: 'flex-end' },
  cardValor: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  acoesRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { padding: 4 },
  btnExcluir: { padding: 4 },
  btnAcaoTexto: { fontSize: 16 },
  semDados: { color: '#aac', textAlign: 'center', marginTop: 40, fontSize: 14 },
  btnNova: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    backgroundColor: AZUL_MEDIO, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  btnNovaTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
});