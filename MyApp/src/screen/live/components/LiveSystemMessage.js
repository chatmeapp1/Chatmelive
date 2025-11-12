// src/screen/live/components/LiveSystemMessage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LiveSystemMessage({ onLayout }) {
  return (
    <View style={styles.box} onLayout={onLayout}>
      <Text style={styles.text}>
        Platform ini menganjurkan konten sehat
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    top: 80,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 14,
    borderRadius: 20,
  },
  text: {
    color: "#d5f2ff",
    textAlign: "center",
    fontSize: 15,
  },
});