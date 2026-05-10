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
        <Text style={styles.text}>QUANTIDADE</Text>
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
    paddingHorizontal: 10,

    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },

  iconColumn: {
    width: 35,
  },

  itemColumn: {
    flex: 2,
  },

  fabricanteColumn: {
    flex: 2,
  },

  quantidadeColumn: {
    flex: 1.2,
    alignItems: 'center',
  },

  valorColumn: {
    flex: 1,
    alignItems: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },

});