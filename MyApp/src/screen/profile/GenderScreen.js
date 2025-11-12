
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState("laki-laki");

  const genders = [
    { id: "laki-laki", label: "Laki-laki", icon: "male" },
    { id: "perempuan", label: "Perempuan", icon: "female" },
  ];

  const handleSave = () => {
    Alert.alert("Berhasil", "Jenis kelamin berhasil diubah!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>jenis kelamin</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Simpan</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={styles.option}
            onPress={() => setSelectedGender(gender.id)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={gender.icon} size={24} color="#4CAF50" />
              <Text style={styles.optionText}>{gender.label}</Text>
            </View>
            {selectedGender === gender.id && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
