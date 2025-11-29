import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function PartyTabs({ selected = "🔥 Hot", setSelected }) {
  // Hanya tiga tab sesuai permintaan
  const tabs = ["🔥 Hot", "Asia", "Timur Tengah"];

  const handlePress = (tab) => {
    if (typeof setSelected === "function") {
      setSelected(tab);
    } else {
      console.warn("⚠️ setSelected belum didefinisikan di PartyScreen.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tabs.map((tab) => {
          const isActive = selected === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.85}
              onPress={() => handlePress(tab)}
              style={[
                styles.tabButton,
                isActive ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text style={[styles.tabText, isActive && styles.activeText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    paddingVertical: 6,
  },
  scroll: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  tabButton: {
    borderRadius: 20, // bentuk kapsul
    paddingVertical: 8,
    paddingHorizontal: 18, // lebar menyesuaikan teks
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#B5F5C0", // hijau pastel lembut
  },
  inactiveTab: {
    backgroundColor: "#F2F2F2",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  activeText: {
    color: "#2E7D32", // hijau tua elegan
    fontWeight: "700",
  },
});