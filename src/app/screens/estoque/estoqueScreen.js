import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { getEstoque } from '../../services/estoque/getEstoque';

import Header from '../../components/header.js';

import EstoqueHeader from '../../components/estoqueComponents/estoqueHeader.js';
import TableRow from '../../components/estoqueComponents/estoqueItemRow.js';

import EstoqueAddItemModal from '../../components/estoqueComponents/estoqueAddItemModal.js';
import EstoqueViewItemModal from '../../components/estoqueComponents/estoqueViewItemModal.js';

export default function App() {

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [estoque, setEstoque] = useState([]);

  useEffect(() => {

    loadEstoque();

  }, []);

  async function loadEstoque() {

    const response = await getEstoque();

    if (response.success) {

      setEstoque(response.data);

    } else {

      console.log('Erro ao buscar estoque');

    }

  }

  const filteredData = estoque.filter((item) => {

    const searchText = search.toLowerCase();

    return (
      item.nome?.toLowerCase().includes(searchText) ||
      item.fabricante?.toLowerCase().includes(searchText)
    );

  });

  return (

    <View style={styles.container}>

      <Header />

      <View style={styles.topContent}>

        <View style={styles.titleRow}>

          <Text style={styles.title}>
            Estoque
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>
              ADICIONAR ITEM
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.searchContainer}>

          <Text style={styles.searchLabel}>
            Pesquisar:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar item..."
            value={search}
            onChangeText={setSearch}
          />

        </View>

      </View>

      <EstoqueHeader />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <TableRow
            item={item.nome}
            fabricante={item.fabricante}
            quantidade={item.quantidade}
            valor={item.valor}
            onView={() => {

              setSelectedItem(item);

              setViewModalVisible(true);

            }}
          />

        )}
      />

      <EstoqueViewItemModal
        visible={viewModalVisible}
        item={selectedItem}
        onClose={() => setViewModalVisible(false)}
        loadEstoque={loadEstoque}
      />

      <EstoqueAddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        loadEstoque={loadEstoque}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#377FC3',
  },

  topContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    gap: 18,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  addButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 15,
  },

});