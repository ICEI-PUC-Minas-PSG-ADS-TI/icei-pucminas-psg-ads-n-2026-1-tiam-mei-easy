import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ onPressNotification }) {
  return (
    <View style={styles.container}>
      
      <View style={styles.side} />

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
  },
});