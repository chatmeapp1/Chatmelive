import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const tabs = ["🔥 Hot", "Asia", "Timur Tengah", "Eropa & Amrik"];

export default function CategoryTabs({ selected, setSelected }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selected === tab && styles.active]}
          onPress={() => setSelected(tab)}
        >
          <Text style={[styles.text, selected === tab && styles.textActive]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    paddingVertical: 12,
    paddingLeft: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },
  active: {
    backgroundColor: "#e0b3ff",
  },
  text: { color: "#555", fontWeight: "500" },
  textActive: { color: "#7e2ce3", fontWeight: "bold" },
});