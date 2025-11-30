import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const { width } = Dimensions.get("window");

const COUNTRIES = {
  ID: "Indonesia",
  MY: "Malaysia",
  SG: "Singapore",
  TH: "Thailand",
  PH: "Philippines",
  VN: "Vietnam",
};

export default function AgencyBankAccountScreen({ navigation, route }) {
  const { agencyId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agencyData, setAgencyData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    bankName: "",
    bankAccount: "",
    bankUsername: "",
  });

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get("/agency/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const data = response.data.data;
        setAgencyData(data);
        if (data.country || data.bank_name || data.bank_account || data.bank_username) {
          setFormData({
            country: data.country || "",
            bankName: data.bank_name || "",
            bankAccount: data.bank_account || "",
            bankUsername: data.bank_username || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading agency data:", error);
      Alert.alert("Error", "Failed to load agency data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.country || !formData.bankName || !formData.bankAccount || !formData.bankUsername) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.post(
        `/agency/${agencyData.id}/bank-account`,
        {
          country: formData.country,
          bank_name: formData.bankName,
          bank_account: formData.bankAccount,
          bank_username: formData.bankUsername,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert("Sukses", "Informasi rekening bank berhasil disimpan!");
        setShowPreview(false);
        loadAgencyData();
      } else {
        Alert.alert("Error", response.data.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D1B4E" />

      {/* Header with Agency Info */}
      <LinearGradient colors={["#2D1B4E", "#1F0F3A"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank account details</Text>

        {/* Agency Logo Circle */}
        <View style={styles.agencyInfo}>
          {agencyData?.logo_url ? (
            <Image
              source={{ uri: agencyData.logo_url }}
              style={styles.agencyLogo}
            />
          ) : (
            <View style={styles.agencyLogoPlaceholder}>
              <Ionicons name="business" size={48} color="#9AEC9A" />
            </View>
          )}
          <Text style={styles.agencyName}>{agencyData?.family_name}</Text>
          <Text style={styles.agencyId}>ID:{agencyData?.id}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Country Dropdown */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Negara</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.dropdownText}>
                {formData.country ? COUNTRIES[formData.country] : "Pilih Negara"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Bank Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bank name</Text>
            <TextInput
              style={styles.input}
              placeholder="BRI"
              value={formData.bankName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bankName: text }))
              }
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Bank Account */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bank account</Text>
            <TextInput
              style={styles.input}
              placeholder="326301029020535"
              value={formData.bankAccount}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bankAccount: text }))
              }
              keyboardType="numeric"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Bank Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bank username</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Pemilik Rekening"
              value={formData.bankUsername}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bankUsername: text }))
              }
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Jika Anda perlu mengganti akun Anda, silakan hubungi admin
          </Text>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Negara</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.countryList}>
              {Object.entries(COUNTRIES).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={styles.countryOption}
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, country: code }));
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.countryOptionText}>{name}</Text>
                  {formData.country === code && (
                    <Ionicons name="checkmark" size={20} color="#7C3AED" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Pratinjau Informasi</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.previewBody}>
              {/* Agency Info */}
              <View style={styles.previewAgencyInfo}>
                {agencyData?.logo_url ? (
                  <Image
                    source={{ uri: agencyData.logo_url }}
                    style={styles.previewLogo}
                  />
                ) : (
                  <View style={styles.previewLogoPlaceholder}>
                    <Ionicons name="business" size={40} color="#7C3AED" />
                  </View>
                )}
                <Text style={styles.previewAgencyName}>{agencyData?.family_name}</Text>
                <Text style={styles.previewAgencyId}>ID:{agencyData?.id}</Text>
              </View>

              {/* Preview Fields */}
              <View style={styles.previewFieldsContainer}>
                <View style={styles.previewField}>
                  <Text style={styles.previewFieldLabel}>Negara</Text>
                  <Text style={styles.previewFieldValue}>
                    {COUNTRIES[formData.country]}
                  </Text>
                </View>

                <View style={styles.previewField}>
                  <Text style={styles.previewFieldLabel}>Bank name</Text>
                  <Text style={styles.previewFieldValue}>{formData.bankName}</Text>
                </View>

                <View style={styles.previewField}>
                  <Text style={styles.previewFieldLabel}>Bank account</Text>
                  <Text style={styles.previewFieldValue}>{formData.bankAccount}</Text>
                </View>

                <View style={styles.previewField}>
                  <Text style={styles.previewFieldLabel}>Bank username</Text>
                  <Text style={styles.previewFieldValue}>{formData.bankUsername}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Preview Actions */}
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.cancelButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 12,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  agencyInfo: {
    alignItems: "center",
  },
  agencyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 8,
  },
  agencyLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  agencyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  agencyId: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    paddingVertical: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 13,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#C9A7E5",
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  countryList: {
    paddingHorizontal: 16,
  },
  countryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  countryOptionText: {
    fontSize: 14,
    color: "#333",
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  previewContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  previewBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  previewAgencyInfo: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  previewLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  previewLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  previewAgencyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  previewAgencyId: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  previewFieldsContainer: {
    marginBottom: 20,
  },
  previewField: {
    marginBottom: 16,
  },
  previewFieldLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  previewFieldValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  previewActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
