import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Header from "../../components/header.js";
import ButtonNavigation from "../../components/buttonDefault.js";

export default function HomeScreen({ navigation }) {
  const userName = "Gustavo";

  
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.greeting}>Olá, {userName} 👋</Text>

        <View style={styles.grid}>
          <ButtonNavigation
            title="Clientes"
            onPress={() => navigation.navigate("Clientes")}
          />

          <ButtonNavigation
            title="Categorias"
            onPress={() => navigation.navigate("ListaCategorias")}
          />

          <ButtonNavigation
            title="Recorrências"
            onPress={() => navigation.navigate("ListaRecorrencias")}
          />

          <ButtonNavigation
            title="Movimentações"
             onPress={() => navigation.navigate("ListaMovimentacoes")}
          />

          <ButtonNavigation
            title="Estoque"
            onPress={() => navigation.navigate("Estoque")}
          />

          <ButtonNavigation
            title="Relatórios"
            onPress={() => navigation.navigate("Relatórios")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12, // se não funcionar no seu RN, te mostro alternativa
  },
});