import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileStats() {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.value}>99</Text>
        <Text style={styles.label}>Ikuti</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.value}>0</Text>
        <Text style={styles.label}>Penggemar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: -10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: "#eee",
    height: "60%",
  },
  value: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  label: {
    color: "#777",
    fontSize: 13,
  },
});