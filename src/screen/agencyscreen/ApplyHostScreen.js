
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import RegionPickerModal from "../../components/RegionPickerModal";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ApplyHostScreen({ navigation }) {
  const [region, setRegion] = useState("");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [userId, setUserId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Female");
  const [paperwork, setPaperwork] = useState("ID card");
  const [idNumber, setIdNumber] = useState("");
  const [consent, setConsent] = useState(false);

  // Fetch real user ID on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No auth token found");
        return;
      }

      const response = await api.get("/auth/profile");
      if (response.data.success && response.data.data.id) {
        setUserId(response.data.data.id.toString());
        console.log("✅ User ID loaded:", response.data.data.id);
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

  const handleSubmit = async () => {
    if (!region || !familyId || !name || !idNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (idNumber.length !== 16) {
      Alert.alert("Error", "ID Card must be exactly 16 digits (KTP)");
      return;
    }
    if (!consent) {
      Alert.alert("Error", "Please agree to the Anchor Authentication Protocol");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      
      const response = await api.post(
        "/hosts/apply",
        {
          region,
          familyId: parseInt(familyId),
          name,
          gender,
          idNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert("Success", response.data.message || "Your host application has been submitted!", [
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

  const handleProtocolPress = () => {
    Alert.alert("Anchor Authentication Protocol", "Terms and conditions...");
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
          <Text style={styles.headerTitle}>Apply For Anchor</Text>
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

        {/* Join Family */}
        <View style={styles.row}>
          <Text style={styles.label}>Join Family</Text>
          <TextInput
            style={styles.input}
            placeholder="Please input family ID"
            placeholderTextColor="#bbb"
            value={familyId}
            onChangeText={setFamilyId}
            keyboardType="numeric"
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

        {/* ID (16 Digit KTP) */}
        <View style={styles.row}>
          <Text style={styles.label}>ID (16 Digit KTP)</Text>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <TextInput
              style={[styles.input, idNumber.length === 16 ? styles.inputValid : idNumber.length > 0 ? styles.inputInvalid : null]}
              placeholder="16 digits"
              placeholderTextColor="#bbb"
              value={idNumber}
              onChangeText={(text) => {
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
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            region && familyId && name && idNumber.length === 16 && consent ? styles.submitButtonActive : styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!region || !familyId || !name || idNumber.length !== 16 || !consent}
        >
          <Text 
            style={[
              styles.submitText,
              region && familyId && name && idNumber.length === 16 && consent ? styles.submitTextActive : styles.submitTextDisabled
            ]}
          >
            Confirm submission
          </Text>
        </TouchableOpacity>

        {/* Consent Checkbox */}
        <View style={styles.consentRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConsent(!consent)}
          >
            <View style={styles.checkboxCircle}>
              {consent && <View style={styles.checkboxDot} />}
            </View>
            <Text style={styles.consentText}>Submission is consent </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProtocolPress}>
            <Text style={styles.protocolLink}>《Anchor Authentication Protocol》</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 15,
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
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6EE096",
  },
  consentText: {
    fontSize: 14,
    color: "#666",
  },
  protocolLink: {
    fontSize: 14,
    color: "#007AFF",
  },
});
