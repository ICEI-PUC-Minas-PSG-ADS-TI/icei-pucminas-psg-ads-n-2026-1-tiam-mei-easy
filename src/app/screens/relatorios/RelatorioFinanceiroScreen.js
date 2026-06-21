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
import { useAuth } from '../../context/AuthContext';
import ScreenHeader from '../../components/ScreenHeader';
import { formatarDataBR } from '../../utils/formatacao';
import Colors from '../../constants/colors';

export default function RelatorioFinanceiroScreen({ navigation }) {
  const { userId } = useAuth();
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
        getMovimentacoes(userId, {
          tipo: filtroTipo || undefined,
          dataInicio: dataInicio.toISOString().slice(0, 10),
          dataFim: dataFim.toISOString().slice(0, 10),
        }),
        getCategorias(userId, 'receita'),
        getCategorias(userId, 'despesa'),
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
  }, [periodoId, filtroTipo, categoriaId, userId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const resumo = calcularResumo(movimentacoes);

  function renderItem({ item }) {
    const isReceita = item.tipo === 'receita';
    return (
      <View style={styles.linha}>
        <View style={styles.linhaEsquerda}>
          <Text style={styles.linhaDescricao}>{item.descricao || (isReceita ? 'Receita' : 'Despesa')}</Text>
          <Text style={styles.linhaMeta}>
            {item.categoria?.descricao || 'Sem categoria'} · {formatarDataBR(item.data)}
          </Text>
        </View>
        <Text style={[styles.linhaValor, { color: isReceita ? Colors.receita : Colors.despesa }]}>
          {isReceita ? '+' : '-'}{formatarMoeda(item.valor)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader onBack={() => navigation.navigate('Relatórios')} />

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
  container: { flex: 1, backgroundColor: Colors.primary },
  filtrosBox: { paddingHorizontal: 16, paddingBottom: 8 },
  titulo: { color: Colors.white, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: Colors.textMuted, fontSize: 12, marginBottom: 12 },
  periodosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tipoRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: Colors.primaryMedium,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipAtivo: { borderColor: Colors.accent },
  chipTexto: { color: Colors.textSoft, fontSize: 12 },
  chipTextoAtivo: { color: Colors.white, fontWeight: '600' },
  resumoRow: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  resumoItem: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  linha: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linhaEsquerda: { flex: 1, marginRight: 8 },
  linhaDescricao: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  linhaMeta: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  linhaValor: { fontSize: 14, fontWeight: 'bold' },
  semDados: { color: Colors.textMuted, textAlign: 'center', marginTop: 32 },
});
