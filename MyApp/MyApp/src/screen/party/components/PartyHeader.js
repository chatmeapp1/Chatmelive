import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PartyHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.follow}>Mengikuti</Text>
      <Text style={styles.active}>Berpesta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  follow: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
  active: {
    fontSize: 20,
    color: "#3CD070", // pastel hijau
    fontWeight: "700",
    marginLeft: 15,
    textDecorationLine: "underline",
  },
});