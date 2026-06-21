import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const RELATORIOS = [
  {
    id: 'dashboard',
    titulo: 'Resumo Financeiro',
    descricao: 'Totais de receitas, despesas, lucro/prejuízo e gráfico comparativo.',
    rota: 'Dashboard',
  },
  {
    id: 'financeiro',
    titulo: 'Relatório de Movimentações',
    descricao: 'Lista detalhada filtrável por período, tipo e categoria.',
    rota: 'RelatorioFinanceiro',
  },
];

const TOTAIS = [
  { id: 'clientes', label: 'Clientes cadastrados', campo: 'totalClientes' },
  { id: 'categorias', label: 'Categorias cadastradas', campo: 'totalCategorias' },
  { id: 'contas', label: 'Contas registradas', campo: 'totalContas' },
  { id: 'estoque', label: 'Itens no estoque', campo: 'totalEstoque' },
  { id: 'movimentacoes', label: 'Movimentações realizadas', campo: 'totalMovimentacoes' },
];

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

export default function RelatoriosScreen({ navigation }) {
  const { userId } = useAuth();
  const [totais, setTotais] = useState({
    totalClientes: 0,
    totalCategorias: 0,
    totalContas: 0,
    totalEstoque: 0,
    totalMovimentacoes: 0,
  });
  const [carregando, setCarregando] = useState(false);

  const carregarTotais = useCallback(async () => {
    if (!userId) return;

    setCarregando(true);
    try {
      const contar = async (colecao) => {
        const snap = await getDocs(
          query(collection(db, colecao), where('usuarioId', '==', userId))
        );
        return snap.size;
      };

      const [totalClientes, totalCategorias, totalContas, totalEstoque, totalMovimentacoes] =
        await Promise.all([
          contar('clientes'),
          contar('categorias'),
          contar('contas'),
          contar('estoque'),
          contar('movimentacoes'),
        ]);

      setTotais({
        totalClientes,
        totalCategorias,
        totalContas,
        totalEstoque,
        totalMovimentacoes,
      });
    } catch (error) {
      console.log('Erro ao carregar relatórios:', error);
    } finally {
      setCarregando(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      carregarTotais();
    }, [carregarTotais])
  );

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
        <Text style={styles.titulo}>Relatórios</Text>

        <Text style={styles.secaoTitulo}>Visão geral do negócio</Text>
        {carregando ? (
          <ActivityIndicator color="#4fc3f7" size="large" style={styles.loader} />
        ) : (
          <View style={styles.totaisGrid}>
            {TOTAIS.map((item) => (
              <View key={item.id} style={styles.totalCard}>
                <Text style={styles.totalNumero}>{totais[item.campo]}</Text>
                <Text style={styles.totalLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.secaoTitulo, styles.secaoTituloEspaco]}>
          Relatórios detalhados
        </Text>
        <Text style={styles.subtitulo}>Escolha o relatório que deseja visualizar</Text>

        {RELATORIOS.map((rel) => (
          <TouchableOpacity
            key={rel.id}
            style={styles.menuCard}
            onPress={() => navigation.navigate(rel.rota)}
          >
            <Text style={styles.menuCardTitulo}>{rel.titulo}</Text>
            <Text style={styles.menuCardDescricao}>{rel.descricao}</Text>
            <Text style={styles.menuCardLink}>Abrir →</Text>
          </TouchableOpacity>
        ))}
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
  titulo: { color: BRANCO, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  secaoTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  secaoTituloEspaco: { marginTop: 8 },
  subtitulo: { color: '#aac', fontSize: 13, marginBottom: 12 },
  loader: { marginVertical: 24 },
  totaisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  totalCard: {
    width: '47%',
    backgroundColor: AZUL_MEDIO,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  totalNumero: { color: BRANCO, fontSize: 28, fontWeight: 'bold' },
  totalLabel: { color: '#cce', fontSize: 12, marginTop: 4, textAlign: 'center' },
  menuCard: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AZUL_MEDIO,
  },
  menuCardTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  menuCardDescricao: { color: '#aac', fontSize: 13, marginBottom: 10 },
  menuCardLink: { color: '#4fc3f7', fontSize: 13, fontWeight: '600' },
});
