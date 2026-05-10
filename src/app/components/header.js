import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Header({ onPressNotification }) {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomePage = route.name === "Home";

  return (
    <View style={styles.container}>
      
      {isHomePage ? (
        <View style={styles.side} />
      ) : (
        <TouchableOpacity
          style={styles.side}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
      )}

      <Text style={styles.logo}>
        MEI <Text style={styles.highlight}>EASY</Text>
      </Text>

      <TouchableOpacity style={styles.side} onPress={onPressNotification}>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },

  highlight: {
    color: "#2ecc71",
  },

  side: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});