
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NicknameScreen({ navigation }) {
  const [nickname, setNickname] = useState("GOPAY");

  const handleSave = () => {
    if (nickname.trim() === "") {
      Alert.alert("Error", "Sebutan intim tidak boleh kosong!");
      return;
    }
    Alert.alert("Berhasil", "Sebutan intim berhasil diubah!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sebutan intim</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Simpan</Text>
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
