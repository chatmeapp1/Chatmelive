
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutUsScreen({ navigation }) {
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
        <Text style={styles.headerText}>tentang kita</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Ionicons name="settings" size={60} color="#6EE096" />
          </View>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>nomor versi: V1.5.4.72010.10159</Text>

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Perjanjian Pengguna</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Perjanjian Siaran Langsung</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>Copyright © 2025</Text>
          <Text style={styles.appName}>Chatme live</Text>
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

  content: { paddingTop: 30, paddingBottom: 50, alignItems: "center" },

  iconContainer: {
    marginBottom: 20,
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: "#d4f4dd",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  versionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },

  menuItem: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuText: {
    fontSize: 15,
    color: "#444",
  },

  footer: {
    marginTop: 50,
    alignItems: "center",
  },
  copyright: {
    fontSize: 13,
    color: "#999",
    marginBottom: 5,
  },
  appName: {
    fontSize: 14,
    color: "#666",
  },
});
