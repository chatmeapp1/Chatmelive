import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { authAPI } from "../../utils/api";

export default function SettingsScreen({ navigation }) {
  const userId = "703256893"; // Contoh ID user, nanti ambil dari context/state

  const handleLogout = () => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await authAPI.logout();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Auth" }],
                })
              );
            } catch (error) {
              console.error("❌ Logout error:", error);
              Alert.alert("Error", "Failed to logout");
            }
          },
        },
      ]
    );
  };

  const handleUnregister = () => {
    Alert.alert(
      "Keluar daftar",
      "Apakah Anda yakin ingin keluar dari aplikasi dan membatalkan nomor ponsel yang terdaftar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar Daftar",
          style: "destructive",
          onPress: () => {
            // Implementasi unregister
            console.log("User unregistered");
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: "person-outline",
      label: "profil pribadi",
      screen: "EditProfileScreen",
    },
    {
      icon: "person-outline",
      label: "Pengaturan Kepribadian",
      screen: "PersonalitySettingsScreen",
    },
    {
      icon: "lock-closed-outline",
      label: "pengaturan Privasi",
      screen: "PrivacySettingsScreen",
    },
    {
      icon: "globe-outline",
      label: "multi lingual",
      screen: "LanguageSettingsScreen",
    },
    {
      icon: "ban",
      label: "Daftar hitam",
      screen: "BlacklistScreen",
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.label}
      style={styles.row}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={styles.menuItemContainer}>
        <Ionicons name={item.icon} size={22} color="#6EE096" />
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );

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
        <Text style={styles.headerText}>Pengaturan</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Nomor ID */}
        <View style={styles.row}>
          <Text style={styles.label}>nomor ID</Text>
          <Text style={styles.value}>{userId}</Text>
        </View>

        {/* Profil Pribadi */}
        {menuItems.map((item) => renderMenuItem(item))}

        {/* Bersihkan Simpanan Lambat */}
        <View style={styles.row}>
          <Text style={styles.label}>bersihkan simpanan lambat</Text>
          <Text style={styles.cacheSize}>18,34MB</Text>
        </View>

        {/* Logout Akun */}
        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.menuItemContainer}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" />
            <Text style={styles.logoutText}>Logout akun</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Keluar Daftar */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleUnregister}
        >
          <Text style={styles.logoutText}>keluar daftar</Text>
        </TouchableOpacity>
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

  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  label: { fontSize: 15, color: "#444" },
  value: { fontSize: 15, color: "#333", fontWeight: "500" },
  cacheSize: { fontSize: 15, color: "#4CAF50" },

  logoutBtn: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 12,
    marginHorizontal: 16,
    gap: 8,
  },
});