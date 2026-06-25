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

export default function LoginScreen({ navigation }) {
  const { login, recuperarSenha } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      await login(email, senha);
    } catch (error) {
      Alert.alert('Erro ao entrar', mensagemErroAuth(error));
    } finally {
      setCarregando(false);
    }
  }

  async function handleRecuperarSenha() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail para recuperar a senha.');
      return;
    }

    try {
      await recuperarSenha(email);
      Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir a senha.');
    } catch (error) {
      Alert.alert('Erro', mensagemErroAuth(error));
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>
          MEI <Text style={styles.logoDestaque}>EASY</Text>
        </Text>
        <Text style={styles.subtitulo}>Entre na sua conta</Text>

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
          placeholder="Sua senha"
          placeholderTextColor="#889"
          secureTextEntry
        />

        <TouchableOpacity onPress={handleRecuperarSenha} style={styles.linkBtn}>
          <Text style={styles.linkTexto}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#1a2a5e" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.botaoSecundarioTexto}>Criar conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AZUL_ESCURO },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  logoDestaque: { color: '#4fc3f7' },
  subtitulo: { color: '#aac', textAlign: 'center', marginTop: 8, marginBottom: 32 },
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
  linkBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  linkTexto: { color: '#4fc3f7', fontSize: 13 },
  botao: {
    backgroundColor: '#4fc3f7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: AZUL_ESCURO, fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AZUL_MEDIO,
  },
  botaoSecundarioTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
