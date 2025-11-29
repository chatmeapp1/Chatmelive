
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PersonalitySettingsScreen({ navigation }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameDataEnabled, setGameDataEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pengaturan Kepribadian</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Efek Suara Hadiah */}
        <View style={styles.row}>
          <Text style={styles.label}>Efek Suara Hadiah</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: "#ccc", true: "#6EE096" }}
            thumbColor={soundEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Menyembunyikan Data Game */}
        <View style={styles.row}>
          <Text style={styles.label}>Menyembunyikan data game</Text>
          <Switch
            value={gameDataEnabled}
            onValueChange={setGameDataEnabled}
            trackColor={{ false: "#ccc", true: "#6EE096" }}
            thumbColor={gameDataEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#6EE096",
    paddingTop: 45,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backBtn: { position: "absolute", left: 15, top: 45 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  content: { paddingTop: 10 },

  row: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { fontSize: 15, color: "#444" },
});
