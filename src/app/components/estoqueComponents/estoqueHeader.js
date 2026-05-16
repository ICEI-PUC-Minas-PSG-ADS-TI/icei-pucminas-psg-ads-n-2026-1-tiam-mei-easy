import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function EstoqueHeader() {

  return (

    <View style={styles.container}>

      <View style={styles.iconColumn} />

      <View style={styles.itemColumn}>
        <Text style={styles.text}>ITEM</Text>
      </View>

      <View style={styles.fabricanteColumn}>
        <Text style={styles.text}>FABRICANTE</Text>
      </View>

      <View style={styles.quantidadeColumn}>
        <Text style={styles.text}>QTDE.</Text>
      </View>

      <View style={styles.valorColumn}>
        <Text style={styles.text}>VALOR</Text>
      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 14,
    paddingHorizontal: 22,

    marginHorizontal: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },

  iconColumn: {
    width: 54,
  },

  itemColumn: {
    flex: 2,
    justifyContent: 'center',
  },

  fabricanteColumn: {
    flex: 2,
    justifyContent: 'center',
  },

  quantidadeColumn: {
    flex: 1,
    alignItems: 'center',
  },

  valorColumn: {
    flex: 1,
    alignItems: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

});