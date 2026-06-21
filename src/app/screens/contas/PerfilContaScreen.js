import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';

export default function PerfilContaScreen({ navigation }) {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (user) carregarPerfil();
  }, [user]);

  async function carregarPerfil() {
    try {
      const usuario = user;

      if (!usuario) {
        Alert.alert('Erro', 'Nenhum usuário autenticado.');
        return;
      }

      setNome(usuario.displayName || '');
      setEmail(usuario.email || '');

      const refUsuario = doc(db, 'users', usuario.uid);
      const documento = await getDoc(refUsuario);

      if (documento.exists()) {
        const dados = documento.data();

        setNome(dados.nome || usuario.displayName || '');
        setEmail(dados.email || usuario.email || '');
        setTelefone(dados.telefone || '');
      } else {
        await setDoc(refUsuario, {
          nome: usuario.displayName || '',
          email: usuario.email || '',
          telefone: '',
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar o perfil.');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarPerfil() {
    try {
      const usuario = user;

      if (!usuario) {
        Alert.alert('Erro', 'Nenhum usuário autenticado.');
        return;
      }

      await updateProfile(usuario, {
        displayName: nome,
      });

      const refUsuario = doc(db, 'users', usuario.uid);

      await updateDoc(refUsuario, {
        nome: nome,
        email: email,
        telefone: telefone,
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ScreenHeader />
        <Text style={styles.titulo}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Meu Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={email}
          editable={false}
          placeholder="E-mail"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Digite seu telefone"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.botao} onPress={salvarPerfil}>
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.white,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.textSoft,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.surface,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: Colors.white,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  botao: {
    backgroundColor: Colors.primaryMedium,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
