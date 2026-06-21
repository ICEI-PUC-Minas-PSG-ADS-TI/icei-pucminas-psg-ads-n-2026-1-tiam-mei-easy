import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMovimentacoes } from '../../services/movimentacoesService';
import {
  PERIODOS,
  getIntervaloPeriodo,
  formatarIntervalo,
  calcularResumo,
  agruparComparativo,
  formatarMoeda,
} from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import ScreenHeader from '../../components/ScreenHeader';
import { ChipGroup } from '../../components/FilterChip';
import Colors from '../../constants/colors';

function GraficoComparativo({ dados }) {
  if (!dados.length) {
    return <Text style={styles.semDados}>Sem movimentações no período.</Text>;
  }

  const maxValor = Math.max(...dados.flatMap((d) => [d.receitas, d.despesas]), 1);

  return (
    <View>
      <View style={styles.legendaRow}>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: Colors.receita }]} />
          <Text style={styles.legendaTexto}>Receitas</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: Colors.despesa }]} />
          <Text style={styles.legendaTexto}>Despesas</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.graficoRow}>
          {dados.map((item) => (
            <View key={item.label} style={styles.graficoColuna}>
              <View style={styles.barrasWrapper}>
                <View
                  style={[
                    styles.barra,
                    {
                      height: Math.max((item.receitas / maxValor) * 120, item.receitas > 0 ? 4 : 0),
                      backgroundColor: Colors.receita,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barra,
                    {
                      height: Math.max((item.despesas / maxValor) * 120, item.despesas > 0 ? 4 : 0),
                      backgroundColor: Colors.despesa,
                    },
                  ]}
                />
              </View>
              <Text style={styles.graficoLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { userId } = useAuth();
  const [periodoId, setPeriodoId] = useState('mes_atual');
  const [carregando, setCarregando] = useState(false);
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, resultado: 0 });
  const [grafico, setGrafico] = useState([]);
  const [intervaloLabel, setIntervaloLabel] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const { dataInicio, dataFim } = getIntervaloPeriodo(periodoId);
      const movimentacoes = await getMovimentacoes(userId, {
        dataInicio: dataInicio.toISOString().slice(0, 10),
        dataFim: dataFim.toISOString().slice(0, 10),
      });

      setResumo(calcularResumo(movimentacoes));
      setGrafico(agruparComparativo(movimentacoes, dataInicio, dataFim));
      setIntervaloLabel(formatarIntervalo(dataInicio, dataFim));
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o dashboard.');
    } finally {
      setCarregando(false);
    }
  }, [periodoId, userId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const lucro = resumo.resultado >= 0;

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.tituloSecao}>Dashboard Financeiro</Text>
        <Text style={styles.subtitulo}>{intervaloLabel}</Text>

        <ChipGroup
          options={PERIODOS.map((p) => ({ label: p.label, value: p.id }))}
          value={periodoId}
          onChange={setPeriodoId}
        />

        {carregando ? (
          <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.cardsRow}>
              <View style={styles.cardResumo}>
                <Text style={styles.cardLabel}>Receitas</Text>
                <Text style={[styles.cardValor, { color: '#4fc3f7' }]}>
                  {formatarMoeda(resumo.receitas)}
                </Text>
              </View>
              <View style={styles.cardResumo}>
                <Text style={styles.cardLabel}>Despesas</Text>
                <Text style={[styles.cardValor, { color: '#ff6b6b' }]}>
                  {formatarMoeda(resumo.despesas)}
                </Text>
              </View>
            </View>

            <View style={[styles.cardResultado, { borderColor: lucro ? '#27ae60' : '#e74c3c' }]}>
              <Text style={styles.cardLabel}>Resultado</Text>
              <Text style={[styles.resultadoValor, { color: lucro ? '#27ae60' : '#e74c3c' }]}>
                {lucro ? '+' : '-'}{formatarMoeda(resumo.resultado)}
              </Text>
              <Text style={styles.resultadoStatus}>{lucro ? 'Lucro' : 'Prejuízo'}</Text>
            </View>

            <View style={styles.graficoBox}>
              <Text style={styles.graficoTitulo}>Comparativo por período</Text>
              <GraficoComparativo dados={grafico} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  conteudo: { padding: 16, paddingBottom: 32 },
  tituloSecao: { color: Colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: Colors.textMuted, fontSize: 13, marginBottom: 16 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cardResumo: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cardLabel: { color: Colors.textMuted, fontSize: 12, marginBottom: 6 },
  cardValor: { fontSize: 18, fontWeight: 'bold' },
  cardResultado: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  resultadoValor: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  resultadoStatus: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  graficoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  graficoTitulo: { color: Colors.white, fontWeight: 'bold', marginBottom: 16 },
  legendaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaCor: { width: 12, height: 12, borderRadius: 2 },
  legendaTexto: { color: Colors.textMuted, fontSize: 12 },
  graficoRow: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 4 },
  graficoColuna: { alignItems: 'center', marginRight: 16, minWidth: 48 },
  barrasWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 120 },
  barra: { width: 14, borderRadius: 4 },
  graficoLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 6 },
  semDados: { color: Colors.textMuted, textAlign: 'center', paddingVertical: 24 },
});
