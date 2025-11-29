
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
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ApplyHostScreen({ navigation }) {
  const [region, setRegion] = useState("");
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

  const handleSubmit = () => {
    if (!familyId || !name || !idNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (!consent) {
      Alert.alert("Error", "Please agree to the Anchor Authentication Protocol");
      return;
    }
    Alert.alert("Success", "Your host application has been submitted!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Region</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
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

        {/* ID */}
        <View style={styles.row}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#bbb"
            value={idNumber}
            onChangeText={setIdNumber}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Confirm submission</Text>
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
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  submitText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
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
