// src/screen/PrivateChatScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PrivateChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💬 Private Chat Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});