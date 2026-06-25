import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

export default function TableRow({
  item,
  fabricante,
  quantidade,
  valor,
  onView,
}) {

  return (

    <View style={styles.container}>

      <View style={styles.iconColumn}>

        <TouchableOpacity onPress={onView}>

          <Feather
            name="eye"
            size={18}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </View>

      <View style={styles.itemColumn}>

        <Text
          style={styles.text}
          numberOfLines={1}
        >
          {item}
        </Text>

      </View>

      <View style={styles.fabricanteColumn}>

        <Text
          style={styles.text}
          numberOfLines={1}
        >
          {fabricante}
        </Text>

      </View>

      <View style={styles.quantidadeColumn}>

        <Text style={styles.text}>
          {quantidade}
        </Text>

      </View>

      <View style={styles.valorColumn}>

        <Text style={styles.text}>
          R$ {valor} 
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 14,
    paddingHorizontal: 12,

    backgroundColor: '#243570',

    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 10,
  },

  iconColumn: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#2d5be3',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
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
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },

});