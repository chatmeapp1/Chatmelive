
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AgeScreen({ navigation }) {
  const [selectedAge, setSelectedAge] = useState(22);

  const ages = Array.from({ length: 63 }, (_, i) => i + 18); // 18-80

  const handleSave = () => {
    Alert.alert("Berhasil", "Usia berhasil diubah!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>usia</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Simpan</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.ageGrid}>
          {ages.map((age) => (
            <TouchableOpacity
              key={age}
              style={[
                styles.ageBox,
                selectedAge === age && styles.ageBoxSelected,
              ]}
              onPress={() => setSelectedAge(age)}
            >
              <Text
                style={[
                  styles.ageText,
                  selectedAge === age && styles.ageTextSelected,
                ]}
              >
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    flex: 1,
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 10,
  },
  ageBox: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  ageBoxSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  ageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  ageTextSelected: {
    color: "#FFF",
  },
});
