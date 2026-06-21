import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const BRANCO = '#ffffff';

export default function RelatoriosScreen({ navigation }) {
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
        <Text style={styles.subtitulo}>Escolha o relatório que deseja visualizar</Text>

        {RELATORIOS.map((rel) => (
          <TouchableOpacity
            key={rel.id}
            style={styles.card}
            onPress={() => navigation.navigate(rel.rota)}
          >
            <Text style={styles.cardTitulo}>{rel.titulo}</Text>
            <Text style={styles.cardDescricao}>{rel.descricao}</Text>
            <Text style={styles.cardLink}>Abrir →</Text>
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
  titulo: { color: BRANCO, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: '#aac', fontSize: 13, marginBottom: 20 },
  card: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AZUL_MEDIO,
  },
  cardTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardDescricao: { color: '#aac', fontSize: 13, marginBottom: 10 },
  cardLink: { color: '#4fc3f7', fontSize: 13, fontWeight: '600' },
});
