// ✅ MyApp/src/screen/live/components/LiveToolbar.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LiveToolbar({ onGift, onChat, onExit }) {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.btn} onPress={onChat}>
        <Ionicons name="chatbubble-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onGift}>
        <Ionicons name="gift-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnExit} onPress={onExit}>
        <Ionicons name="close" size={22} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 15,
    alignItems: "center",
  },
  btn: {
    marginVertical: 6,
    backgroundColor: "rgba(0,0,0,0.40)",
    padding: 10,
    borderRadius: 30,
  },
  btnExit: {
    marginTop: 10,
    backgroundColor: "rgba(255,0,0,0.6)",
    padding: 12,
    borderRadius: 30,
  },
});