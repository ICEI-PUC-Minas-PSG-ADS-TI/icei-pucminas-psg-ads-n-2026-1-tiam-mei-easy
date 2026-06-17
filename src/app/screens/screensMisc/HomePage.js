import { useTheme } from '../../context/ThemeContext';
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Header from "../../components/header.js";
import ButtonNavigation from "../../components/buttonDefault.js";

export default function HomeScreen({ navigation }) {
  const userName = "Gustavo";
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#121212" : "#FFF",
      }}
    >
      <Header />

      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          alignSelf: "flex-end",
          marginRight: 20,
          marginTop: 10,
          paddingVertical: 5,
          paddingHorizontal: 12,
          backgroundColor: theme === "dark" ? "#333" : "#E0E0E0",
          borderRadius: 15,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: theme === "dark" ? "#FFF" : "#000",
          }}
        >
          {theme === "light" ? "🌙 Escuro" : "☀️ Claro"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.greeting,
          { color: theme === "dark" ? "#FFF" : "#333" },
        ]}
      >
        Olá, {userName} 👋
      </Text>

      <View style={styles.grid}>
        
        <ButtonNavigation
          title="Clientes"
          onPress={() => navigation.navigate("Clientes")}
        />

        <ButtonNavigation
          title="Metas"
          onPress={() => navigation.navigate("Metas")}
        />
        
        <ButtonNavigation
          title="Categorias"
          onPress={() => navigation.navigate("ListaCategorias")}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 12,
  },
});