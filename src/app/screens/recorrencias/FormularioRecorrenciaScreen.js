import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  criarRecorrencia,
  atualizarRecorrencia,
} from '../../services/recorrenciasService';

const USUARIO_ID = 'usuario_teste';

export default function FormularioRecorrenciaScreen({
  navigation,
  route,
}) {
  const edicao = route?.params?.recorrencia || null;

  const [descricao, setDescricao] = useState(
    edicao?.descricao || ''
  );

  const [valor, setValor] = useState(
    edicao?.valor ? String(edicao.valor) : ''
  );

  const [tipo, setTipo] = useState(
    edicao?.tipo || 'despesa'
  );

  const [diaDoMes, setDiaDoMes] = useState(
    edicao?.diaDoMes ? String(edicao.diaDoMes) : ''
  );

  const [ativo, setAtivo] = useState(
    edicao?.ativo !== undefined ? edicao.ativo : true
  );

  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    if (!descricao || !valor || !diaDoMes) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      const dados = {
        usuarioId: USUARIO_ID,
        descricao,
        valor,
        tipo,
        diaDoMes,
        ativo,
      };

      if (edicao) {
        await atualizarRecorrencia(edicao.id, dados);

        Alert.alert(
          'Sucesso',
          'Recorrência atualizada!'
        );
      } else {
        await criarRecorrencia(dados);

        Alert.alert(
          'Sucesso',
          'Recorrência criada!'
        );
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitulo}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.titulo}>
          {edicao
            ? 'Editar recorrência'
            : 'Nova recorrência'}
        </Text>

        <Text style={styles.label}>Tipo</Text>

        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[
              styles.btnTipo,
              tipo === 'receita' &&
                styles.btnTipoAtivo,
            ]}
            onPress={() => setTipo('receita')}
          >
            <Text style={styles.btnTipoIcone}>↑</Text>

            <Text style={styles.btnTipoTexto}>
              Receita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnTipo,
              tipo === 'despesa' &&
                styles.btnTipoAtivo,
            ]}
            onPress={() => setTipo('despesa')}
          >
            <Text style={styles.btnTipoIcone}>↓</Text>

            <Text style={styles.btnTipoTexto}>
              Despesa
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Aluguel"
          placeholderTextColor="#aac"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Valor</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 1500"
          placeholderTextColor="#aac"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <Text style={styles.label}>Dia do mês</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 5"
          placeholderTextColor="#aac"
          keyboardType="numeric"
          value={diaDoMes}
          onChangeText={setDiaDoMes}
        />

        <TouchableOpacity
          style={[
            styles.btnAtivo,
            ativo && styles.btnAtivoLigado,
          ]}
          onPress={() => setAtivo(!ativo)}
        >
          <Text style={styles.btnAtivoTexto}>
            {ativo ? 'Recorrência ativa' : 'Recorrência inativa'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSalvar}
          onPress={salvar}
          disabled={carregando}
        >
          <Text style={styles.btnSalvarTexto}>
            {carregando
              ? 'Salvando...'
              : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const AZUL_CLARO = '#3a6ff0';
const BRANCO = '#ffffff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AZUL_ESCURO,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: AZUL_ESCURO,
  },

  btnVoltar: {
    padding: 4,
  },

  btnVoltarTexto: {
    color: BRANCO,
    fontSize: 22,
  },

  headerTitulo: {
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerDestaque: {
    color: '#4fc3f7',
  },

  body: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },

  label: {
    color: BRANCO,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  tipoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  btnTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  btnTipoAtivo: {
    borderColor: '#4fc3f7',
    backgroundColor: AZUL_CLARO,
  },

  btnTipoIcone: {
    color: BRANCO,
    fontSize: 18,
    fontWeight: 'bold',
  },

  btnTipoTexto: {
    color: BRANCO,
    fontSize: 15,
    fontWeight: '600',
  },

  input: {
    backgroundColor: AZUL_MEDIO,
    color: BRANCO,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 18,
  },

  btnAtivo: {
    backgroundColor: '#243570',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  btnAtivoLigado: {
    borderWidth: 2,
    borderColor: '#4fc3f7',
  },

  btnAtivoTexto: {
    color: BRANCO,
    fontSize: 15,
    fontWeight: '600',
  },

  btnSalvar: {
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },

  btnSalvarTexto: {
    color: BRANCO,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

