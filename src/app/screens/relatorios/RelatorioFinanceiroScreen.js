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
import { ChipGroup, FilterChip } from '../../components/FilterChip';

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

        <ChipGroup
          options={PERIODOS.map((p) => ({ label: p.label, value: p.id }))}
          value={periodoId}
          onChange={setPeriodoId}
        />

        <ChipGroup
          horizontal={false}
          options={[
            { label: 'Todos', value: '' },
            { label: 'Receitas', value: 'receita' },
            { label: 'Despesas', value: 'despesa' },
          ]}
          value={filtroTipo}
          onChange={setFiltroTipo}
        />

        <View style={styles.categoriasRow}>
          <FilterChip label="Todas" selected={!categoriaId} onPress={() => setCategoriaId('')} />
          {categorias.map((c) => (
            <FilterChip
              key={c.id}
              label={c.descricao}
              selected={categoriaId === c.id}
              onPress={() => setCategoriaId(c.id)}
            />
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
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 24 }} />
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
  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
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
