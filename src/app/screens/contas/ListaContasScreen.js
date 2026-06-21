import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getContas,
  excluirConta,
  alternarStatusConta,
} from '../../services/contasService';
import { useAuth } from '../../context/AuthContext';

export default function ListaContasScreen({ navigation }) {
  const { userId } = useAuth();
  const [tipoAba, setTipoAba] = useState('pagar'); // 'pagar' | 'receber'
  const [filtroStatus, setFiltroStatus] = useState(''); // '' | 'pendente' | 'pago'
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [tipoAba, filtroStatus])
  );

  async function carregar() {
    setCarregando(true);
    try {
      const filtros = {
        tipo: tipoAba,
        status: filtroStatus || undefined,
      };
      const lista = await getContas(userId, filtros);
      setContas(lista);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as contas.');
    } finally {
      setCarregando(false);
    }
  }

  function voltar() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }

  function formatarValor(valor) {
    return `R$ ${parseFloat(valor || 0).toFixed(2).replace('.', ',')}`;
  }

  function formatarData(data) {
    if (!data) return '';
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
  }

  async function alternarStatus(item) {
    try {
      await alternarStatusConta(item.id, item.status);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  }

  function confirmarExclusao(item) {
    if (Platform.OS === 'web') {
      const confirmado = window.confirm(
        `Deseja excluir "${item.descricao || 'esta conta'}"?`
      );
      if (confirmado) {
        excluirConta(item.id)
          .then(() => carregar())
          .catch(() => alert('Não foi possível excluir.'));
      }
    } else {
      Alert.alert(
        'Excluir conta',
        `Deseja excluir "${item.descricao || 'esta conta'}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await excluirConta(item.id);
                carregar();
              } catch {
                Alert.alert('Erro', 'Não foi possível excluir.');
              }
            },
          },
        ]
      );
    }
  }

  const totalPendente = contas
    .filter((c) => c.status !== 'pago')
    .reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);

  const totalPago = contas
    .filter((c) => c.status === 'pago')
    .reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);

  function renderItem({ item }) {
    const isPago = item.status === 'pago';
    const isPagar = tipoAba === 'pagar';
    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <View style={styles.cardEsquerda}>
            <View
              style={[
                styles.icone,
                { backgroundColor: isPagar ? '#e74c3c' : '#27ae60' },
              ]}
            >
              <Text style={styles.iconeTexto}>{isPagar ? '↓' : '↑'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardDescricao} numberOfLines={1}>
                {item.descricao || 'Sem descrição'}
              </Text>
              <Text style={styles.cardVencimento}>
                Vencimento: {formatarData(item.vencimento)}
              </Text>
            </View>
          </View>
          <Text style={styles.cardValor}>{formatarValor(item.valor)}</Text>
        </View>

        <View style={styles.cardBaixo}>
          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: isPago ? '#27ae60' : '#e0a800' },
            ]}
            onPress={() => alternarStatus(item)}
          >
            <Text style={styles.statusTexto}>
              {isPago ? '✓ Pago' : '⏳ Pendente'}
            </Text>
          </TouchableOpacity>

          <View style={styles.acoesRow}>
            <TouchableOpacity
              style={styles.btnEditar}
              onPress={() =>
                navigation.navigate('FormularioConta', { conta: item })
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={voltar}
          style={styles.btnVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>
        <View style={styles.btnHeaderDir} />
      </View>

      <Text style={styles.subtitulo}>Contas a Pagar e Receber</Text>

      {/* Abas tipo */}
      <View style={styles.abaRow}>
        {['pagar', 'receber'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.aba, tipoAba === t && styles.abaAtiva]}
            onPress={() => setTipoAba(t)}
          >
            <Text style={[styles.abaTexto, tipoAba === t && styles.abaTextoAtivo]}>
              {t === 'pagar' ? 'A Pagar' : 'A Receber'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtro de status */}
      <View style={styles.filtroStatusRow}>
        {['', 'pendente', 'pago'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.btnFiltroStatus, filtroStatus === s && styles.btnFiltroStatusAtivo]}
            onPress={() => setFiltroStatus(s)}
          >
            <Text style={styles.btnFiltroStatusTexto}>
              {s === '' ? 'Todos' : s === 'pendente' ? 'Pendentes' : 'Pagos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Resumo */}
      <View style={styles.resumoRow}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>
            {tipoAba === 'pagar' ? 'A pagar (pendente)' : 'A receber (pendente)'}
          </Text>
          <Text style={[styles.resumoValor, { color: '#ff6b6b' }]}>
            {formatarValor(totalPendente)}
          </Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Pago</Text>
          <Text style={[styles.resumoValor, { color: '#4fc3f7' }]}>
            {formatarValor(totalPago)}
          </Text>
        </View>
      </View>

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator color="#4fc3f7" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={contas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.semDados}>
              Nenhuma conta {tipoAba === 'pagar' ? 'a pagar' : 'a receber'} encontrada.
            </Text>
          }
        />
      )}

      {/* Botão Nova Conta */}
      <TouchableOpacity
        style={styles.btnNova}
        onPress={() =>
          navigation.navigate('FormularioConta', { tipoInicial: tipoAba })
        }
      >
        <Text style={styles.btnNovaTexto}>+ Nova Conta</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  btnVoltar: { width: 36, paddingVertical: 4 },
  btnVoltarTexto: { color: BRANCO, fontSize: 22 },
  headerTitulo: {
    flex: 1,
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerDestaque: { color: '#4fc3f7' },
  btnHeaderDir: { width: 36 },
  subtitulo: {
    color: BRANCO,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  abaRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  aba: {
    flex: 1,
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  abaAtiva: { borderColor: '#4fc3f7' },
  abaTexto: { color: '#aac', fontSize: 14, fontWeight: '600' },
  abaTextoAtivo: { color: BRANCO },
  filtroStatusRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  btnFiltroStatus: {
    flex: 1,
    backgroundColor: '#243570',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  btnFiltroStatusAtivo: { borderColor: '#4fc3f7' },
  btnFiltroStatusTexto: { color: BRANCO, fontSize: 12, fontWeight: '600' },
  resumoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: AZUL_MEDIO,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  resumoLabel: { color: '#cce', fontSize: 12, marginBottom: 4, textAlign: 'center' },
  resumoValor: { fontSize: 16, fontWeight: 'bold' },
  lista: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#243570',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: BRANCO, fontSize: 15, fontWeight: '600' },
  cardVencimento: { color: '#aac', fontSize: 12, marginTop: 2 },
  cardValor: { color: BRANCO, fontSize: 15, fontWeight: 'bold' },
  cardBaixo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTexto: { color: BRANCO, fontSize: 12, fontWeight: 'bold' },
  acoesRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { padding: 4 },
  btnExcluir: { padding: 4 },
  btnAcaoTexto: { fontSize: 16 },
  semDados: {
    color: '#aac',
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
    backgroundColor: AZUL_MEDIO,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnNovaTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
});