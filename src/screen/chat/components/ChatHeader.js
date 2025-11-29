import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.tabRow}>
        <Text style={[styles.tab, styles.activeTab]}>Pesan</Text>
        <Text style={styles.tab}>Teman dekat</Text>
      </View>

      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="call-outline" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    fontSize: 22,
    fontWeight: "600",
    color: "#888",
    marginRight: 15,
  },
  activeTab: {
    color: "#222",
    fontWeight: "700",
  },
  iconButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 6,
  },
});