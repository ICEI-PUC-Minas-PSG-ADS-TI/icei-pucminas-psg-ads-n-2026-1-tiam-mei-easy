import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function RelatoriosScreen({ navigation }) {
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalContas, setTotalContas] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [totalMovimentacoes, setTotalMovimentacoes] = useState(0);

  useEffect(() => {
    carregarRelatorios();
  }, []);

  async function carregarRelatorios() {
    try {
      const clientes = await getDocs(collection(db, "clientes"));
      const categorias = await getDocs(collection(db, "categorias"));
      const contas = await getDocs(collection(db, "contas"));
      const estoque = await getDocs(collection(db, "estoque"));
      const movimentacoes = await getDocs(collection(db, "movimentacoes"));

      setTotalClientes(clientes.size);
      setTotalCategorias(categorias.size);
      setTotalContas(contas.size);
      setTotalEstoque(estoque.size);
      setTotalMovimentacoes(movimentacoes.size);
    } catch (error) {
      console.log("Erro ao carregar relatórios:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Relatórios</Text>

      <View style={styles.card}>
        <Text style={styles.numero}>{totalClientes}</Text>
        <Text style={styles.texto}>Clientes cadastrados</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.numero}>{totalCategorias}</Text>
        <Text style={styles.texto}>Categorias cadastradas</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.numero}>{totalContas}</Text>
        <Text style={styles.texto}>Contas registradas</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.numero}>{totalEstoque}</Text>
        <Text style={styles.texto}>Itens no estoque</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.numero}>{totalMovimentacoes}</Text>
        <Text style={styles.texto}>Movimentações realizadas</Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#3f3db8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  numero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },

  texto: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },

  botao: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});