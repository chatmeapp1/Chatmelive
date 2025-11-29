
import React, { useState, useEffect } from "react";
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
import api from "../../utils/api";

export default function SignatureScreen({ navigation }) {
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSignature();
  }, []);

  const loadSignature = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setSignature(response.data.data.signature || "");
      }
    } catch (error) {
      console.error("Error loading signature:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (signature.trim().length > 100) {
      Alert.alert("Error", "Tanda tangan maksimal 100 karakter!");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/auth/profile/update", {
        signature: signature.trim(),
      });

      if (response.data.success) {
        Alert.alert("Berhasil", "Tanda tangan pribadi berhasil diubah!");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", response.data.message || "Gagal menyimpan");
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>tanda tangan pribadi</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButton}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={signature}
            onChangeText={setSignature}
            placeholder="Masukkan tanda tangan pribadi"
            multiline
            maxLength={100}
          />
          <Text style={styles.counter}>{signature.length}/100</Text>
        </View>
        <Text style={styles.hint}>
          Tanda tangan akan ditampilkan di profil Anda
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
    fontWeight: "600",
    color: "#FFF",
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  counter: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});
