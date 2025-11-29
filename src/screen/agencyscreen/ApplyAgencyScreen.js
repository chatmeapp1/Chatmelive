
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import RegionPickerModal from "../../components/RegionPickerModal";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ApplyAgencyScreen({ navigation }) {
  const [region, setRegion] = useState("");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [userId] = useState("703256893"); // Auto-filled from user session
  const [familyName, setFamilyName] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Female");
  const [paperwork, setPaperwork] = useState("ID card");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");

  // Check if all required fields are filled
  const isFormComplete = () => {
    return region && familyName && name && idNumber && phone && idNumber.length === 16;
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      if (!idNumber || idNumber.length !== 16) {
        Alert.alert("Error", "ID Card must be exactly 16 digits (KTP)");
        return;
      }
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      
      const response = await api.post(
        "/agency/apply",
        {
          region,
          familyName,
          name,
          idNumber,
          phone,
          gender,
          paperwork: "ID card",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert("Success", response.data.message || "Your agency application has been submitted!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response?.data?.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to submit application");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#9AEC9A" />
      
      {/* Header */}
      <LinearGradient
        colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply For Family</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Region */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowRegionPicker(true)}
        >
          <Text style={styles.label}>Region</Text>
          <View style={styles.rowRight}>
            {region ? (
              <Text style={styles.valueText}>{region}</Text>
            ) : null}
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        {/* User ID */}
        <View style={styles.row}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.valueText}>{userId}</Text>
        </View>

        {/* Family Name */}
        <View style={styles.row}>
          <Text style={styles.label}>Family Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Please input Family Name"
            placeholderTextColor="#bbb"
            value={familyName}
            onChangeText={setFamilyName}
          />
        </View>

        {/* Name */}
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Please input your name"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Gender */}
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender("Female")}
            >
              <View style={styles.radioCircle}>
                {gender === "Female" && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender("Male")}
            >
              <View style={styles.radioCircle}>
                {gender === "Male" && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Male</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Paperwork */}
        <View style={styles.row}>
          <Text style={styles.label}>Paperwork</Text>
          <Text style={styles.valueText}>ID card</Text>
        </View>

        {/* ID */}
        <View style={styles.row}>
          <Text style={styles.label}>ID (16 Digit KTP)</Text>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <TextInput
              style={[styles.input, idNumber.length === 16 ? styles.inputValid : idNumber.length > 0 ? styles.inputInvalid : null]}
              placeholder="16 digits"
              placeholderTextColor="#bbb"
              value={idNumber}
              onChangeText={(text) => {
                // Only allow numbers and max 16 digits
                const numericText = text.replace(/[^0-9]/g, '');
                if (numericText.length <= 16) {
                  setIdNumber(numericText);
                }
              }}
              keyboardType="numeric"
              maxLength={16}
            />
            {idNumber.length > 0 && (
              <Text style={styles.digitCounter}>
                {idNumber.length}/16 digits
              </Text>
            )}
          </View>
        </View>

        {/* Phone */}
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#bbb"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isFormComplete() ? styles.submitButtonActive : styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!isFormComplete()}
        >
          <Text 
            style={[
              styles.submitText,
              isFormComplete() ? styles.submitTextActive : styles.submitTextDisabled
            ]}
          >
            Confirm submission
          </Text>
        </TouchableOpacity>
      </View>

      {/* Region Picker Modal */}
      <RegionPickerModal
        visible={showRegionPicker}
        onClose={() => setShowRegionPicker(false)}
        onSelect={(selectedRegion) => setRegion(selectedRegion)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeText: {
    fontSize: 16,
    color: "#fff",
  },
  form: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  valueText: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "right",
    marginLeft: 20,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6EE096",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: "#6EE096",
  },
  submitButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "500",
  },
  submitTextActive: {
    color: "#fff",
  },
  submitTextDisabled: {
    color: "#999",
  },
  inputValid: {
    borderBottomColor: "#6EE096",
    borderBottomWidth: 2,
  },
  inputInvalid: {
    borderBottomColor: "#FF6B6B",
    borderBottomWidth: 2,
  },
  digitCounter: {
    fontSize: 12,
    color: "#bbb",
    marginTop: 4,
    textAlign: "right",
  },
});
