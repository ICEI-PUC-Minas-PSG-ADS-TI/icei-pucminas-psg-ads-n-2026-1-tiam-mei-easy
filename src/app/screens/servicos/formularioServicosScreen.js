import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';

import {
  criarServico,
  atualizarServico,
  excluirServico,
} from '../../services/servicosService';

export default function FormularioServicoScreen({
  navigation,
  route,
}) {
  const { userId } = useAuth();

  const servico = route?.params?.servico;
  const editando = !!servico;

  const [nome, setNome] = useState(servico?.nome || '');
  const [descricao, setDescricao] = useState(
    servico?.descricao || ''
  );
  const [valor, setValor] = useState(
    servico?.valor?.toString() || ''
  );

  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Validação', 'Informe o nome do serviço.');
      return;
    }

    if (!valor.trim()) {
      Alert.alert('Validação', 'Informe o valor do serviço.');
      return;
    }

    try {
      setSalvando(true);

      const dados = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        valor: Number(
          valor.replace('.', '').replace(',', '.')
        ),
      };

      if (editando) {
        await atualizarServico(servico.id, dados);

        Alert.alert(
          'Sucesso',
          'Serviço atualizado com sucesso.'
        );
      } else {
        await criarServico(userId, dados);

        Alert.alert(
          'Sucesso',
          'Serviço cadastrado com sucesso.'
        );
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar o serviço.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function remover() {
    Alert.alert(
      'Excluir Serviço',
      'Deseja realmente excluir este serviço?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirServico(servico.id);

              Alert.alert(
                'Sucesso',
                'Serviço excluído com sucesso.'
              );

              navigation.goBack();
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível excluir o serviço.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>
            {editando
              ? 'Editar Serviço'
              : 'Novo Serviço'}
          </Text>

          <Text style={styles.label}>
            Nome do serviço
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do serviço"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>
            Descrição
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.inputDescricao,
            ]}
            placeholder="Descreva o serviço..."
            placeholderTextColor="#999"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>
            Valor
          </Text>

          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor="#999"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />

          {editando && (
            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={remover}
            >
              <Text
                style={styles.botaoExcluirTexto}
              >
                Excluir Serviço
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.botaoSalvar}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator
              color={Colors.white}
            />
          ) : (
            <Text
              style={styles.botaoSalvarTexto}
            >
              {editando
                ? 'Atualizar Serviço'
                : 'Salvar Serviço'}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    padding: 16,
    paddingBottom: 140,
  },

  titulo: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  label: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    backgroundColor: Colors.surface,
    color: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 15,
  },

  inputDescricao: {
    height: 120,
  },

  botaoExcluir: {
    backgroundColor: '#c0392b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  botaoExcluirTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  botaoSalvar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: Colors.primaryMedium,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  botaoSalvarTexto: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 