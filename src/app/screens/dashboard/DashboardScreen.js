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

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

function GraficoComparativo({ dados }) {
  if (!dados.length) {
    return <Text style={styles.semDados}>Sem movimentações no período.</Text>;
  }

  const maxValor = Math.max(...dados.flatMap((d) => [d.receitas, d.despesas]), 1);

  return (
    <View>
      <View style={styles.legendaRow}>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: '#4fc3f7' }]} />
          <Text style={styles.legendaTexto}>Receitas</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: '#ff6b6b' }]} />
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
                      backgroundColor: '#4fc3f7',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barra,
                    {
                      height: Math.max((item.despesas / maxValor) * 120, item.despesas > 0 ? 4 : 0),
                      backgroundColor: '#ff6b6b',
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

  function voltar() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
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

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.tituloSecao}>Dashboard Financeiro</Text>
        <Text style={styles.subtitulo}>{intervaloLabel}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodosScroll}>
          {PERIODOS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.btnPeriodo, periodoId === p.id && styles.btnPeriodoAtivo]}
              onPress={() => setPeriodoId(p.id)}
            >
              <Text style={[styles.btnPeriodoTexto, periodoId === p.id && styles.btnPeriodoTextoAtivo]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {carregando ? (
          <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 40 }} />
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
  conteudo: { padding: 16, paddingBottom: 32 },
  tituloSecao: { color: BRANCO, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: '#aac', fontSize: 13, marginBottom: 16 },
  periodosScroll: { marginBottom: 20 },
  btnPeriodo: {
    backgroundColor: AZUL_MEDIO,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  btnPeriodoAtivo: { borderColor: '#4fc3f7' },
  btnPeriodoTexto: { color: '#cce', fontSize: 13, fontWeight: '600' },
  btnPeriodoTextoAtivo: { color: BRANCO },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cardResumo: {
    flex: 1,
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cardLabel: { color: '#aac', fontSize: 12, marginBottom: 6 },
  cardValor: { fontSize: 18, fontWeight: 'bold' },
  cardResultado: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  resultadoValor: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  resultadoStatus: { color: '#aac', fontSize: 13, marginTop: 4 },
  graficoBox: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 16,
  },
  graficoTitulo: { color: BRANCO, fontWeight: 'bold', marginBottom: 16 },
  legendaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaCor: { width: 12, height: 12, borderRadius: 2 },
  legendaTexto: { color: '#aac', fontSize: 12 },
  graficoRow: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 4 },
  graficoColuna: { alignItems: 'center', marginRight: 16, minWidth: 48 },
  barrasWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 120 },
  barra: { width: 14, borderRadius: 4 },
  graficoLabel: { color: '#aac', fontSize: 11, marginTop: 6 },
  semDados: { color: '#aac', textAlign: 'center', paddingVertical: 24 },
});
