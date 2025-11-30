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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyAddHostScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(false);
  const [hostUserId, setHostUserId] = useState("");
  const [agencyData, setAgencyData] = useState(null);

  useEffect(() => {
    fetchAgencyData();
  }, []);

  const fetchAgencyData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await api.get("/agency/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAgencyData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching agency data:", error);
    }
  };

  const handleAddHost = async () => {
    if (!hostUserId.trim()) {
      Alert.alert("Error", "Please enter host user ID");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await api.post(
        "/agency/add-host",
        {
          hostUserId: parseInt(hostUserId),
          agencyId: agencyId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert("Success", "Host invitation sent successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", response.data.message || "Failed to add host");
      }
    } catch (error) {
      console.error("Error adding host:", error);
      if (error.response?.data?.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to send host invitation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9AEC9A" />

      <LinearGradient
        colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Host</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Agency Info */}
        {agencyData && (
          <View style={styles.agencyCard}>
            <View style={styles.agencyIconContainer}>
              <Ionicons name="business" size={40} color="#9AEC9A" />
            </View>
            <Text style={styles.agencyName}>{agencyData.family_name}</Text>
            <Text style={styles.agencyId}>ID: {agencyData.id}</Text>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <Ionicons name="information-circle" size={24} color="#9AEC9A" />
            <Text style={styles.instructionTitle}>How to Add Host</Text>
          </View>
          <View style={styles.instructionSteps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Enter the host's user ID below
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Host will receive an invitation
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Host can accept to join your agency
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Host User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter host user ID"
            placeholderTextColor="#bbb"
            value={hostUserId}
            onChangeText={setHostUserId}
            keyboardType="numeric"
            editable={!loading}
          />
          <Text style={styles.helperText}>
            Ask the host for their user ID from their profile
          </Text>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleAddHost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={styles.submitText}>Send Invitation</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="bulb" size={24} color="#9AEC9A" />
          <Text style={styles.infoText}>
            The invited host will need to confirm their agency application before
            they can officially join your agency.
          </Text>
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  agencyCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agencyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0F9F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  agencyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  agencyId: {
    fontSize: 13,
    color: "#999",
  },
  instructionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  instructionSteps: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#9AEC9A",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#9AEC9A",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  infoCard: {
    backgroundColor: "#F0F9F5",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
});
