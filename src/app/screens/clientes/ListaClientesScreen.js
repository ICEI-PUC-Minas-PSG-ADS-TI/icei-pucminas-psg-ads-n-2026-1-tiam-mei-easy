import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const AZUL_CLARO = '#4fc3f7';
const BRANCO = '#ffffff';

export default function ListaClientesScreen() {
  const [nome, setNome] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);

  async function buscarClientes() {
    try {
      const querySnapshot = await getDocs(collection(db, 'clientes'));

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
    try {
      if (clienteEditando) {
        await updateDoc(doc(db, 'clientes', clienteEditando), {
          nome: nome,
        });

        alert('Cliente atualizado com sucesso!');
        setClienteEditando(null);
      } else {
        await addDoc(collection(db, 'clientes'), {
          nome: nome,
          criadoEm: new Date(),
        });

        alert('Cliente salvo com sucesso!');
      }

      setNome('');
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

  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: AZUL_ESCURO, padding: 20 }}>

      {/* TÍTULO */}
      <Text style={{
        fontSize: 24,
        marginTop: 40,
        marginBottom: 20,
        color: BRANCO,
        fontWeight: 'bold',
      }}>
        Clientes
      </Text>

      {/* INPUT */}
      <TextInput
        placeholder="Nome do cliente"
        placeholderTextColor="#aac"
        value={nome}
        onChangeText={setNome}
        style={{
          backgroundColor: AZUL_MEDIO,
          color: BRANCO,
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {/* BOTÃO SALVAR */}
      <TouchableOpacity
        onPress={salvarCliente}
        style={{
          backgroundColor: AZUL_MEDIO,
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: BRANCO, textAlign: 'center', fontWeight: 'bold' }}>
          {clienteEditando ? 'Atualizar Cliente' : 'Salvar Cliente'}
        </Text>
      </TouchableOpacity>

      {/* LISTA */}
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: AZUL_MEDIO,
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{
              fontSize: 18,
              marginBottom: 10,
              color: BRANCO,
              fontWeight: '600',
            }}>
              {item.nome}
            </Text>

            {/* BOTÕES */}
            <TouchableOpacity
              onPress={() => excluirCliente(item.id)}
              style={{
                backgroundColor: '#ff6b6b',
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: BRANCO, textAlign: 'center' }}>
                Excluir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setNome(item.nome);
                setClienteEditando(item.id);
              }}
              style={{
                backgroundColor: AZUL_CLARO,
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Text style={{ color: AZUL_ESCURO, textAlign: 'center', fontWeight: 'bold' }}>
                Editar
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}