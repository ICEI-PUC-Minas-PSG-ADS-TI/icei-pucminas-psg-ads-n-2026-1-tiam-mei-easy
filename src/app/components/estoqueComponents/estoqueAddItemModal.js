import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import { addEstoque } from '../../services/estoque/addEstoque.js';

export default function EstoqueAddItemModal({
  visible,
  onClose,
  loadEstoque
}) {

  const [nome, setNome] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');

  async function handleAddItem() {

    console.log('clicou');


    const response = await addEstoque({
      nome,
      fabricante,
      quantidade,
      valor,
    });

    console.log(response);

    if (response.success) {

      console.log('Item criado');
      await loadEstoque();
      onClose();

    } else {

      console.log('Erro ao criar');

    }



  }


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      loadEstoque
    >

      <View style={styles.overlay}>

        <View style={styles.modalContainer}>

          <Text style={styles.title}>
            Adicionar Item
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Nome do item
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o nome"
                value={nome}
                onChangeText={setNome}
              />

            </View>

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Fabricante
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o fabricante"
                value={fabricante}
                onChangeText={setFabricante}
              />

            </View>

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Quantidade
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite a quantidade"
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
              />

            </View>

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Valor
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o valor"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />

            </View>

          </ScrollView>

          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddItem}
            >
              <Text style={styles.addButtonText}>
                Salvar
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },

  addButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },

});