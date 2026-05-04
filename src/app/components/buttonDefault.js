import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ButtonNavigation({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.cardButtonNavigation} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.textOpcao}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  cardButtonNavigation: {
    width: "43%",
    aspectRatio: 1.7,
    backgroundColor: "#3B3BB3",
    borderRadius: 12,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textOpcao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});