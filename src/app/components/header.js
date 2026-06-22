import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../constants/colors";

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomePage = route.name === "Home";

  return (
    <View style={styles.header}>
      {isHomePage ? (
        <View style={styles.side} />
      ) : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.side}
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitulo}>
        MEI <Text style={styles.headerDestaque}>EASY</Text>
      </Text>

      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: Colors.primary,
  },

  side: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  btnVoltarTexto: {
    color: Colors.white,
    fontSize: 22,
  },

  headerTitulo: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  headerDestaque: {
    color: Colors.accent,
  },
});
