import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const AZUL_CLARO = '#4fc3f7';
const BRANCO = '#ffffff';

export default function ListaClientesScreen({ navigation }) {
  const { userId } = useAuth();

  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [pesquisa, setPesquisa] = useState('');

  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [clienteExpandido, setClienteExpandido] = useState(null);

  async function buscarClientes() {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'clientes'),
        where('usuarioId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setClientes(lista);

    } catch (error) {
      console.log(error);
    }
  }

  async function salvarCliente() {
    if (!userId) return;

    try {

      const dadosCliente = {
        nome,
        cpfCnpj,
        telefone,
        email,
      };

      if (clienteEditando) {

        await updateDoc(
          doc(db, 'clientes', clienteEditando),
          dadosCliente
        );

        alert('Cliente atualizado com sucesso!');

        setClienteEditando(null);

      } else {

        await addDoc(collection(db, 'clientes'), {
          ...dadosCliente,
          usuarioId: userId,
          criadoEm: new Date(),
        });

        alert('Cliente salvo com sucesso!');
      }

      limparCampos();

      buscarClientes();

    } catch (error) {

      console.log(error);
      alert('Erro ao salvar cliente');

    }
  }

  async function excluirCliente(id) {

    try {

      await deleteDoc(doc(db, 'clientes', id));

      buscarClientes();

      alert('Cliente excluído!');

    } catch (error) {

      console.log(error);
      alert('Erro ao excluir cliente');

    }
  }

  function editarCliente(cliente) {

    setNome(cliente.nome || '');
    setCpfCnpj(cliente.cpfCnpj || '');
    setTelefone(cliente.telefone || '');
    setEmail(cliente.email || '');

    setClienteEditando(cliente.id);

  }

  function limparCampos() {

    setNome('');
    setCpfCnpj('');
    setTelefone('');
    setEmail('');

  }

  useFocusEffect(
    useCallback(() => {
      buscarClientes();
    }, [userId])
  );

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          MEI <Text style={styles.logoDestaque}>EASY</Text>
        </Text>

        <Text style={styles.subtitulo}>
          Gerenciamento de Clientes
        </Text>

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* FORMULÁRIO */}
        <View style={styles.cardFormulario}>

          <Text style={styles.cardTitulo}>
            {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
          </Text>

          <TextInput
            placeholder="Nome do cliente"
            placeholderTextColor="#aac"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            placeholder="CPF ou CNPJ"
            placeholderTextColor="#aac"
            value={cpfCnpj}
            onChangeText={setCpfCnpj}
            style={styles.input}
          />

          <TextInput
            placeholder="Telefone"
            placeholderTextColor="#aac"
            value={telefone}
            onChangeText={setTelefone}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aac"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={salvarCliente}
          >
            <Text style={styles.textoBotaoSalvar}>
              {clienteEditando ? 'Atualizar Cliente' : 'Salvar Cliente'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* PESQUISA */}
        <View style={styles.pesquisaContainer}>

          <TextInput
            placeholder="Pesquisar cliente..."
            placeholderTextColor="#aac"
            value={pesquisa}
            onChangeText={setPesquisa}
            style={styles.inputPesquisa}
          />

        </View>

        {/* TÍTULO */}
        <Text style={styles.tituloLista}>
          Clientes Cadastrados
        </Text>

        {/* LISTA */}
        <FlatList
          data={clientesFiltrados}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {

            const expandido = clienteExpandido === item.id;

            return (

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setClienteExpandido(
                    expandido ? null : item.id
                  )
                }
                style={styles.cardCliente}
              >

                {/* TOPO */}
                <View style={styles.cardHeader}>

                  <View>

                    <Text style={styles.nomeCliente}>
                      {item.nome}
                    </Text>

                    <Text style={styles.emailResumo}>
                      {item.email || 'Sem email'}
                    </Text>

                  </View>

                  <Text style={styles.seta}>
                    {expandido ? '▲' : '▼'}
                  </Text>

                </View>

                {/* DETALHES */}
                {expandido && (

                  <View style={styles.detalhesContainer}>

                    <View style={styles.infoBox}>
                      <Text style={styles.label}>
                        CPF/CNPJ
                      </Text>

                      <Text style={styles.valor}>
                        {item.cpfCnpj || 'Não informado'}
                      </Text>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.label}>
                        Telefone
                      </Text>

                      <Text style={styles.valor}>
                        {item.telefone || 'Não informado'}
                      </Text>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.label}>
                        Email
                      </Text>

                      <Text style={styles.valor}>
                        {item.email || 'Não informado'}
                      </Text>
                    </View>

                    {/* BOTÕES */}
                    <View style={styles.botoesRow}>

                      <TouchableOpacity
                        style={styles.botaoEditar}
                        onPress={() => editarCliente(item)}
                      >
                        <Text style={styles.textoBotaoEditar}>
                          Editar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.botaoExcluir}
                        onPress={() => excluirCliente(item.id)}
                      >
                        <Text style={styles.textoBotaoExcluir}>
                          Excluir
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>

                )}

              </TouchableOpacity>

            );
          }}
        />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: AZUL_ESCURO,
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  btnVoltar: {
    paddingRight: 4,
  },

  btnVoltarTexto: {
    color: BRANCO,
    fontSize: 22,
  },

  logo: {
    color: BRANCO,
    fontSize: 28,
    fontWeight: 'bold',
  },

  logoDestaque: {
    color: AZUL_CLARO,
  },

  subtitulo: {
    color: '#cdd6ff',
    marginTop: 6,
    fontSize: 15,
  },

  cardFormulario: {
    backgroundColor: '#243570',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  cardTitulo: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: AZUL_MEDIO,
    color: BRANCO,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
  },

  botaoSalvar: {
    backgroundColor: AZUL_CLARO,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  textoBotaoSalvar: {
    textAlign: 'center',
    color: AZUL_ESCURO,
    fontWeight: 'bold',
    fontSize: 15,
  },

  pesquisaContainer: {
    marginBottom: 18,
  },

  inputPesquisa: {
    backgroundColor: '#243570',
    color: BRANCO,
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
  },

  tituloLista: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  cardCliente: {
    backgroundColor: '#243570',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nomeCliente: {
    color: BRANCO,
    fontSize: 18,
    fontWeight: 'bold',
  },

  emailResumo: {
    color: '#aac',
    marginTop: 4,
    fontSize: 13,
  },

  seta: {
    color: AZUL_CLARO,
    fontSize: 18,
    fontWeight: 'bold',
  },

  detalhesContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3950a8',
    paddingTop: 18,
  },

  infoBox: {
    marginBottom: 14,
  },

  label: {
    color: AZUL_CLARO,
    fontSize: 12,
    marginBottom: 3,
    fontWeight: '600',
  },

  valor: {
    color: BRANCO,
    fontSize: 15,
  },

  botoesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  botaoEditar: {
    flex: 1,
    backgroundColor: AZUL_CLARO,
    padding: 14,
    borderRadius: 10,
  },

  textoBotaoEditar: {
    textAlign: 'center',
    color: AZUL_ESCURO,
    fontWeight: 'bold',
  },

  botaoExcluir: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    padding: 14,
    borderRadius: 10,
  },

  textoBotaoExcluir: {
    textAlign: 'center',
    color: BRANCO,
    fontWeight: 'bold',
  },

});