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
import { mensagemErroAuth } from '../../utils/authErrors';

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';

export default function CadastroScreen({ navigation }) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar(email, senha, nome);
    } catch (error) {
      Alert.alert('Erro ao cadastrar', mensagemErroAuth(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Cadastre-se para gerenciar suas finanças</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor="#889"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#889"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#889"
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Repita a senha"
          placeholderTextColor="#889"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#1a2a5e" />
          ) : (
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AZUL_ESCURO },
  conteudo: { flexGrow: 1, padding: 24, paddingTop: 50 },
  voltar: { marginBottom: 20 },
  voltarTexto: { color: '#4fc3f7', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: '#aac', marginBottom: 28 },
  label: { color: '#cce', fontSize: 14, marginBottom: 6 },
  input: {
    backgroundColor: '#243570',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AZUL_MEDIO,
  },
  botao: {
    backgroundColor: '#4fc3f7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: AZUL_ESCURO, fontSize: 16, fontWeight: 'bold' },
});
