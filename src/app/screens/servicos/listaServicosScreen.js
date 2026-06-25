import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';

import {
  listarServicos,
  excluirServico,
} from '../../services/servicosService';

export default function ListaServicosScreen({ navigation }) {
  const { userId } = useAuth();

  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      setLoading(true);
      const data = await listarServicos(userId);
      setServicos(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar serviços.');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [userId])
  );

  function confirmarExclusao(id) {
    Alert.alert('Excluir serviço', 'Deseja realmente excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirServico(id);
            carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('FormularioServico', {
            servico: item,
          })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.desc}>
            {item.descricao || 'Sem descrição'}
          </Text>
          <Text style={styles.valor}>
            R$ {Number(item.valor).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => confirmarExclusao(item.id)}
        >
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <Text style={styles.title}>Serviços</Text>

      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhum serviço cadastrado
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('FormularioServico')
        }
      >
        <Text style={styles.fabText}>+ Novo Serviço</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  card: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  nome: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  desc: {
    color: '#ccc',
    fontSize: 13,
  },

  valor: {
    color: '#27ae60',
    marginTop: 5,
    fontWeight: 'bold',
  },

  delete: {
    fontSize: 18,
    padding: 6,
  },

  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: Colors.primaryMedium,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  fabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});