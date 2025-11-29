
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGender();
  }, []);

  const loadGender = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setSelectedGender(response.data.data.gender || "");
      }
    } catch (error) {
      console.error("Error loading gender:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGender) {
      Alert.alert("Error", "Pilih jenis kelamin terlebih dahulu!");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/auth/profile/update", {
        gender: selectedGender,
      });

      if (response.data.success) {
        Alert.alert("Berhasil", "Jenis kelamin berhasil diubah!");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", response.data.message || "Gagal menyimpan");
      }
    } catch (error) {
      console.error("Error saving gender:", error);
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
        <Text style={styles.headerTitle}>jenis kelamin</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButton}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedGender === "laki-laki" && styles.selectedOption,
          ]}
          onPress={() => setSelectedGender("laki-laki")}
        >
          <Ionicons
            name="male"
            size={24}
            color={selectedGender === "laki-laki" ? "#4CAF50" : "#666"}
          />
          <Text
            style={[
              styles.optionText,
              selectedGender === "laki-laki" && styles.selectedText,
            ]}
          >
            Laki-laki
          </Text>
          {selectedGender === "laki-laki" && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedGender === "perempuan" && styles.selectedOption,
          ]}
          onPress={() => setSelectedGender("perempuan")}
        >
          <Ionicons
            name="female"
            size={24}
            color={selectedGender === "perempuan" ? "#4CAF50" : "#666"}
          />
          <Text
            style={[
              styles.optionText,
              selectedGender === "perempuan" && styles.selectedText,
            ]}
          >
            Perempuan
          </Text>
          {selectedGender === "perempuan" && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
        </TouchableOpacity>
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    borderColor: "#4CAF50",
    backgroundColor: "#F0F8F4",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  selectedText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
});
