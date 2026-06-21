import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  criarConta,
  atualizarConta,
} from '../../services/contasService';
import { useAuth } from '../../context/AuthContext';
import {
  formatarMoedaInput,
  extrairNumeroMoeda,
} from '../../utils/formatacao';
import { showAlert } from '../../utils/alerts';
import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';

export default function FormularioContaScreen({ navigation, route }) {
  const { userId } = useAuth();
  const edicao = route?.params?.conta || null;
  const tipoInicial = route?.params?.tipoInicial || 'pagar';

  const [tipo, setTipo] = useState(edicao?.tipo || tipoInicial);
  const [descricao, setDescricao] = useState(edicao?.descricao || '');
  const [valorTexto, setValorTexto] = useState(
    edicao?.valor ? formatarMoedaInput(String(Math.round(edicao.valor * 100))) : ''
  );
  const [vencimento, setVencimento] = useState(
    edicao?.vencimento ? edicao.vencimento.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState(edicao?.status || 'pendente');
  const [carregando, setCarregando] = useState(false);

  function handleValorChange(texto) {
    setValorTexto(formatarMoedaInput(texto));
  }

  async function salvar() {
    const valorNumerico = extrairNumeroMoeda(valorTexto);

    if (!descricao.trim()) {
      showAlert('Atenção', 'Informe a descrição da conta.');
      return;
    }
    if (!valorNumerico || valorNumerico <= 0) {
      showAlert('Atenção', 'Informe um valor válido.');
      return;
    }
    if (!vencimento) {
      showAlert('Atenção', 'Informe a data de vencimento.');
      return;
    }

    setCarregando(true);
    try {
      const dados = {
        tipo,
        descricao: descricao.trim(),
        valor: valorNumerico,
        vencimento,
        status,
        usuarioId: userId,
      };

      const tipoLabel = tipo === 'pagar' ? 'a pagar' : 'a receber';

      if (edicao) {
        await atualizarConta(edicao.id, dados);
        showAlert('Sucesso', `Conta ${tipoLabel} atualizada!`, () => navigation.goBack());
      } else {
        await criarConta(dados);
        showAlert('Sucesso', `Nova conta ${tipoLabel} criada!`, () => navigation.goBack());
      }
    } catch (e) {
      console.log('Erro ao salvar conta:', e);
      showAlert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.titulo}>
          {edicao ? 'Editar Conta' : 'Nova Conta'}
        </Text>

        {/* Tipo */}
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'pagar' && styles.btnTipoAtivo]}
            onPress={() => setTipo('pagar')}
          >
            <Text style={styles.btnTipoIcone}>↓</Text>
            <Text style={styles.btnTipoTexto}>A Pagar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'receber' && styles.btnTipoAtivo]}
            onPress={() => setTipo('receber')}
          >
            <Text style={styles.btnTipoIcone}>↑</Text>
            <Text style={styles.btnTipoTexto}>A Receber</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Conta de luz, Pagamento cliente..."
          placeholderTextColor="#aac"
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Valor */}
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          placeholderTextColor="#aac"
          keyboardType="numeric"
          value={valorTexto}
          onChangeText={handleValorChange}
        />

        {/* Vencimento */}
        <Text style={styles.label}>Vencimento</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          placeholderTextColor="#aac"
          value={vencimento}
          onChangeText={setVencimento}
          keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
        />

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.btnTipo, status === 'pendente' && styles.btnTipoAtivo]}
            onPress={() => setStatus('pendente')}
          >
            <Text style={styles.btnTipoTexto}>⏳ Pendente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnTipo, status === 'pago' && styles.btnTipoAtivo]}
            onPress={() => setStatus('pago')}
          >
            <Text style={styles.btnTipoTexto}>✓ Pago</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={carregando}>
          <Text style={styles.btnSalvarTexto}>
            {carregando ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  body: { padding: 20, paddingBottom: 40 },
  titulo: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: { color: Colors.white, fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  tipoRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  btnTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMedium,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  btnTipoAtivo: { borderColor: Colors.accent, backgroundColor: Colors.primaryMedium },
  btnTipoIcone: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
  btnTipoTexto: { color: Colors.white, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: Colors.primaryMedium,
    color: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  btnSalvar: {
    backgroundColor: Colors.primaryMedium,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  btnSalvarTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});