import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getContas,
  excluirConta,
  alternarStatusConta,
} from '../../services/contasService';
import { useAuth } from '../../context/AuthContext';
import { formatarMoedaExibicao, formatarDataBR } from '../../utils/formatacao';
import { showConfirm } from '../../utils/alerts';
import ScreenHeader from '../../components/ScreenHeader';
import { ChipGroup } from '../../components/FilterChip';
import Colors from '../../constants/colors';

export default function ListaContasScreen({ navigation }) {
  const { userId } = useAuth();
  const [tipoAba, setTipoAba] = useState('pagar'); // 'pagar' | 'receber'
  const [filtroStatus, setFiltroStatus] = useState(''); // '' | 'pendente' | 'pago'
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [tipoAba, filtroStatus, userId])
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

  function formatarValor(valor) {
    return formatarMoedaExibicao(valor);
  }

  function formatarData(data) {
    return formatarDataBR(data);
  }

  async function alternarStatus(item) {
    try {
      await alternarStatusConta(item.id, item.status);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  }

  async function confirmarExclusao(item) {
    const confirmado = await showConfirm(
      'Excluir conta',
      `Deseja excluir "${item.descricao || 'esta conta'}"?`
    );
    if (!confirmado) return;

    try {
      await excluirConta(item.id);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir.');
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
      <ScreenHeader />

      <Text style={styles.subtitulo}>Contas a Pagar e Receber</Text>

      <View style={styles.chipsArea}>
        <ChipGroup
        horizontal={false}
        options={[
          { label: 'A Pagar', value: 'pagar' },
          { label: 'A Receber', value: 'receber' },
        ]}
        value={tipoAba}
        onChange={setTipoAba}
      />

      <ChipGroup
        horizontal={false}
        options={[
          { label: 'Todos', value: '' },
          { label: 'Pendentes', value: 'pendente' },
          { label: 'Pagos', value: 'pago' },
        ]}
        value={filtroStatus}
        onChange={setFiltroStatus}
      />
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
          <Text style={[styles.resumoValor, { color: Colors.accent }]}>
            {formatarValor(totalPago)}
          </Text>
        </View>
      </View>

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 40 }} />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  subtitulo: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chipsArea: { paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  resumoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: Colors.primaryMedium,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  resumoLabel: { color: Colors.textSoft, fontSize: 12, marginBottom: 4, textAlign: 'center' },
  resumoValor: { fontSize: 16, fontWeight: 'bold' },
  lista: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface,
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
  iconeTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: Colors.white, fontSize: 15, fontWeight: '600' },
  cardVencimento: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  cardValor: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
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
  statusTexto: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },
  acoesRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { padding: 4 },
  btnExcluir: { padding: 4 },
  btnAcaoTexto: { fontSize: 16 },
  semDados: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.primaryMedium,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnNovaTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});