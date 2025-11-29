
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacySettingsScreen({ navigation }) {
  const permissions = [
    {
      id: 1,
      title: "Izinkan Chatme live untuk mengak...",
      action: "Ke Pengaturan",
    },
    {
      id: 2,
      title: "Izinkan Chatme live untuk menggu...",
      status: "Diaktifkan",
    },
    {
      id: 3,
      title: "Izinkan Chatme live untuk menggu...",
      status: "Diaktifkan",
    },
    {
      id: 4,
      title: "Izinkan Chatme live untuk menggu...",
      status: "Diaktifkan",
    },
  ];

  const recommended = [
    {
      id: 5,
      title: "Izinkan Chatme live untuk menggu...",
      status: "Diaktifkan",
    },
  ];

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
        <Text style={styles.headerText}>pengaturan Privasi</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pengaturan Izin */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan Izin</Text>
          {permissions.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.label} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={item.action ? styles.action : styles.status}>
                {item.action || item.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Pengaturan yang direkomendasikan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan yang direkomendasikan</Text>
          {recommended.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.label} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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

  content: { paddingTop: 10, paddingBottom: 30 },

  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#999",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

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

  label: { fontSize: 15, color: "#444", flex: 1, marginRight: 10 },
  action: { fontSize: 15, color: "#6EE096" },
  status: { fontSize: 15, color: "#666" },
});
