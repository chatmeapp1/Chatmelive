
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LanguageSettingsScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Bahasa Indonesia");

  const languages = [
    "简体中文",
    "繁體中文",
    "English",
    "Bahasa Indonesia",
  ];

  const handleSave = () => {
    // Implementasi penyimpanan bahasa
    console.log("Language saved:", selectedLanguage);
    navigation.goBack();
  };

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
        <Text style={styles.headerText}>pengaturan bahasa</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>simpan</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {languages.map((lang, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.langItem,
              selectedLanguage === lang && styles.langItemSelected,
            ]}
            onPress={() => setSelectedLanguage(lang)}
          >
            <Text
              style={[
                styles.langText,
                selectedLanguage === lang && styles.langTextSelected,
              ]}
            >
              {lang}
            </Text>
            {selectedLanguage === lang && (
              <Ionicons name="checkmark" size={22} color="#6EE096" />
            )}
          </TouchableOpacity>
        ))}
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
    flexDirection: "row",
    justifyContent: "center",
  },
  backBtn: { position: "absolute", left: 15, top: 45 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  saveBtn: { position: "absolute", right: 15, top: 45 },
  saveBtnText: { color: "#fff", fontSize: 16 },

  content: { paddingTop: 10 },

  langItem: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  langItemSelected: {
    backgroundColor: "#f0fdf4",
  },

  langText: {
    fontSize: 15,
    color: "#444",
  },
  langTextSelected: {
    color: "#6EE096",
    fontWeight: "500",
  },
});
