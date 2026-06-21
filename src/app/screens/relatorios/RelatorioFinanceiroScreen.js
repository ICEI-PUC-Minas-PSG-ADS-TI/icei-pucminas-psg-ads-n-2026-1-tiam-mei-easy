import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMovimentacoes } from '../../services/movimentacoesService';
import { getCategorias } from '../../services/categoriasService';
import {
  PERIODOS,
  getIntervaloPeriodo,
  formatarIntervalo,
  calcularResumo,
  formatarMoeda,
} from '../../services/dashboardService';

const USUARIO_ID = 'usuario_teste';
const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

export default function RelatorioFinanceiroScreen({ navigation }) {
  const [periodoId, setPeriodoId] = useState('mes_atual');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [intervaloLabel, setIntervaloLabel] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const { dataInicio, dataFim } = getIntervaloPeriodo(periodoId);
      const [lista, catsReceita, catsDespesa] = await Promise.all([
        getMovimentacoes(USUARIO_ID, {
          tipo: filtroTipo || undefined,
          dataInicio: dataInicio.toISOString().slice(0, 10),
          dataFim: dataFim.toISOString().slice(0, 10),
        }),
        getCategorias(USUARIO_ID, 'receita'),
        getCategorias(USUARIO_ID, 'despesa'),
      ]);

      const cats = [...catsReceita, ...catsDespesa];
      setCategorias(cats);

      const filtradas = categoriaId
        ? lista.filter((m) => m.categoria?.id === categoriaId)
        : lista;

      setMovimentacoes(filtradas);
      setIntervaloLabel(formatarIntervalo(dataInicio, dataFim));
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    } finally {
      setCarregando(false);
    }
  }, [periodoId, filtroTipo, categoriaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const resumo = calcularResumo(movimentacoes);

  function voltar() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Relatórios');
  }

  function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  function renderItem({ item }) {
    const isReceita = item.tipo === 'receita';
    return (
      <View style={styles.linha}>
        <View style={styles.linhaEsquerda}>
          <Text style={styles.linhaDescricao}>{item.descricao || (isReceita ? 'Receita' : 'Despesa')}</Text>
          <Text style={styles.linhaMeta}>
            {item.categoria?.descricao || 'Sem categoria'} · {formatarData(item.data)}
          </Text>
        </View>
        <Text style={[styles.linhaValor, { color: isReceita ? '#4fc3f7' : '#ff6b6b' }]}>
          {isReceita ? '+' : '-'}{formatarMoeda(item.valor)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>
        <View style={styles.btnVoltar} />
      </View>

      <View style={styles.filtrosBox}>
        <Text style={styles.titulo}>Relatório de Movimentações</Text>
        <Text style={styles.subtitulo}>{intervaloLabel}</Text>

        <View style={styles.periodosRow}>
          {PERIODOS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.chip, periodoId === p.id && styles.chipAtivo]}
              onPress={() => setPeriodoId(p.id)}
            >
              <Text style={[styles.chipTexto, periodoId === p.id && styles.chipTextoAtivo]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipoRow}>
          {['', 'receita', 'despesa'].map((t) => (
            <TouchableOpacity
              key={t || 'todos'}
              style={[styles.chip, filtroTipo === t && styles.chipAtivo]}
              onPress={() => setFiltroTipo(t)}
            >
              <Text style={[styles.chipTexto, filtroTipo === t && styles.chipTextoAtivo]}>
                {t === '' ? 'Todos' : t === 'receita' ? 'Receitas' : 'Despesas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.categoriasRow}>
          <TouchableOpacity
            style={[styles.chip, !categoriaId && styles.chipAtivo]}
            onPress={() => setCategoriaId('')}
          >
            <Text style={[styles.chipTexto, !categoriaId && styles.chipTextoAtivo]}>Todas</Text>
          </TouchableOpacity>
          {categorias.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, categoriaId === c.id && styles.chipAtivo]}
              onPress={() => setCategoriaId(c.id)}
            >
              <Text style={[styles.chipTexto, categoriaId === c.id && styles.chipTextoAtivo]}>
                {c.descricao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resumoRow}>
        <Text style={styles.resumoItem}>Receitas: {formatarMoeda(resumo.receitas)}</Text>
        <Text style={styles.resumoItem}>Despesas: {formatarMoeda(resumo.despesas)}</Text>
        <Text style={styles.resumoItem}>
          Resultado: {resumo.resultado >= 0 ? '+' : '-'}{formatarMoeda(resumo.resultado)}
        </Text>
      </View>

      {carregando ? (
        <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.semDados}>Nenhuma movimentação encontrada para os filtros.</Text>
          }
        />
      )}
    </View>
  );
}

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
  btnVoltar: { width: 36 },
  btnVoltarTexto: { color: BRANCO, fontSize: 22 },
  headerTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  headerDestaque: { color: '#4fc3f7' },
  filtrosBox: { paddingHorizontal: 16, paddingBottom: 8 },
  titulo: { color: BRANCO, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: '#aac', fontSize: 12, marginBottom: 12 },
  periodosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tipoRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: AZUL_MEDIO,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipAtivo: { borderColor: '#4fc3f7' },
  chipTexto: { color: '#cce', fontSize: 12 },
  chipTextoAtivo: { color: BRANCO, fontWeight: '600' },
  resumoRow: {
    backgroundColor: '#243570',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  resumoItem: { color: BRANCO, fontSize: 13, fontWeight: '600' },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  linha: {
    backgroundColor: '#243570',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linhaEsquerda: { flex: 1, marginRight: 8 },
  linhaDescricao: { color: BRANCO, fontSize: 14, fontWeight: '600' },
  linhaMeta: { color: '#aac', fontSize: 11, marginTop: 2 },
  linhaValor: { fontSize: 14, fontWeight: 'bold' },
  semDados: { color: '#aac', textAlign: 'center', marginTop: 32 },
});
