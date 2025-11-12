
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

export default function SignatureScreen({ navigation }) {
  const [signature, setSignature] = useState(
    "karakteristik aku justru tanda tangan..."
  );

  const handleSave = () => {
    if (signature.trim() === "") {
      Alert.alert("Error", "Tanda tangan pribadi tidak boleh kosong!");
      return;
    }
    Alert.alert("Berhasil", "Tanda tangan pribadi berhasil diubah!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>tanda tangan pribadi</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Simpan</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={signature}
            onChangeText={setSignature}
            placeholder="Masukkan tanda tangan pribadi"
            multiline
            maxLength={100}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{signature.length}/100</Text>
        </View>
        <Text style={styles.hint}>
          Tanda tangan pribadi akan ditampilkan di profil Anda
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
    minHeight: 100,
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
