import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileShop() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pusat Belanja</Text>
      {/* nanti bisa isi list item */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
});