import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authAPI } from "../../utils/api";

export default function NicknameScreen({ navigation, route }) {
  const currentName = route?.params?.currentName || "User";
  const [nickname, setNickname] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadNickname = async () => {
    try {
      const response = await authAPI.get("/auth/profile");
      if (response.data.success) {
        setNickname(response.data.data.name || "");
      }
    } catch (error) {
      console.error("Error loading nickname:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (nickname.trim().length < 2) {
      Alert.alert("Error", "Nama minimal 2 karakter!");
      return;
    }

    if (nickname.trim().length > 20) {
      Alert.alert("Error", "Nama maksimal 20 karakter!");
      return;
    }

    setSaving(true);
    try {
      const response = await authAPI.updateProfile({
        name: nickname.trim(),
      });
      if (response.success) {
        Alert.alert("Berhasil", "Sebutan intim berhasil diubah!");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.message || "Gagal mengubah sebutan intim");
      }
    } catch (error) {
      console.error("Error updating nickname:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengubah sebutan intim");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sebutan intim</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButton}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Masukkan sebutan intim"
            maxLength={20}
          />
          <Text style={styles.counter}>{nickname.length}/20</Text>
        </View>
        <Text style={styles.hint}>
          Sebutan intim akan ditampilkan di profil Anda
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#4CAF50",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  saveButton: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  counter: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  hint: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
  },
});