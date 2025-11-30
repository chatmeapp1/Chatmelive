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
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import api from "../../utils/api";

const { width } = Dimensions.get("window");

export default function AgencyCertificationScreen({ navigation, route }) {
  const { agencyId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agencyData, setAgencyData] = useState(null);
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyId: "",
    ownerId: "",
    phone: "",
    email: "",
    address: "",
  });
  const [idPhotos, setIdPhotos] = useState({
    front: null,
    back: null,
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
        setFormData({
          agencyName: data.family_name || "",
          agencyId: data.id?.toString() || "",
          ownerId: data.user_id?.toString() || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
        });
        if (data.id_photo_front) {
          setIdPhotos((prev) => ({ ...prev, front: data.id_photo_front }));
        }
        if (data.id_photo_back) {
          setIdPhotos((prev) => ({ ...prev, back: data.id_photo_back }));
        }
      }
    } catch (error) {
      console.error("Error loading agency data:", error);
      Alert.alert("Error", "Failed to load agency data");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (side) => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Izin Ditolak", "Anda perlu memberikan izin untuk mengakses galeri!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIdPhotos((prev) => ({
          ...prev,
          [side]: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleSubmit = async () => {
    if (!idPhotos.front || !idPhotos.back) {
      Alert.alert("Error", "Silakan upload kedua sisi kartu identitas");
      return;
    }

    if (!formData.phone || !formData.email || !formData.address) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const certFormData = new FormData();

      // Add ID photos if they are new (local URIs)
      if (idPhotos.front && idPhotos.front.startsWith("file://")) {
        certFormData.append("id_photo_front", {
          uri: idPhotos.front,
          type: "image/jpeg",
          name: "id_front.jpg",
        });
      }

      if (idPhotos.back && idPhotos.back.startsWith("file://")) {
        certFormData.append("id_photo_back", {
          uri: idPhotos.back,
          type: "image/jpeg",
          name: "id_back.jpg",
        });
      }

      // Add form fields
      certFormData.append("phone", formData.phone);
      certFormData.append("email", formData.email);
      certFormData.append("address", formData.address);

      const response = await api.post(
        `/agency/${agencyData.id}/certification`,
        certFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Sukses", "Data sertifikasi berhasil dikirim untuk review!");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Gagal mengirim data");
      }
    } catch (error) {
      console.error("Error submitting certification:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim data");
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Information collection</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload ID Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload ID photo</Text>
          <View style={styles.photoGrid}>
            {/* Front ID */}
            <TouchableOpacity
              style={styles.photoUploadBox}
              onPress={() => pickImage("front")}
            >
              {idPhotos.front && !idPhotos.front.startsWith("/uploads") ? (
                <>
                  <Image
                    source={{ uri: idPhotos.front }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setIdPhotos((prev) => ({ ...prev, front: null }))}
                  >
                    <FontAwesome name="times-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </>
              ) : idPhotos.front ? (
                <>
                  <Image
                    source={{ uri: idPhotos.front }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setIdPhotos((prev) => ({ ...prev, front: null }))}
                  >
                    <FontAwesome name="times-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="camera" size={32} color="#ccc" />
                  <Text style={styles.uploadText}>
                    Click to upload the front of ID card
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Back ID */}
            <TouchableOpacity
              style={styles.photoUploadBox}
              onPress={() => pickImage("back")}
            >
              {idPhotos.back && !idPhotos.back.startsWith("/uploads") ? (
                <>
                  <Image
                    source={{ uri: idPhotos.back }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setIdPhotos((prev) => ({ ...prev, back: null }))}
                  >
                    <FontAwesome name="times-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </>
              ) : idPhotos.back ? (
                <>
                  <Image
                    source={{ uri: idPhotos.back }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setIdPhotos((prev) => ({ ...prev, back: null }))}
                  >
                    <FontAwesome name="times-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="camera" size={32} color="#ccc" />
                  <Text style={styles.uploadText}>
                    Click to upload the back of ID card
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          {/* Agency Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>Agency name
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.agencyName}
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          {/* Agency ID */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>Agency ID
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.agencyId}
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          {/* Owner ID */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>President ID
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.ownerId}
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>Phone number
            </Text>
            <TextInput
              style={styles.input}
              placeholder="08131649551"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>E-mail
            </Text>
            <TextInput
              style={styles.input}
              placeholder="meongkwl@gmail.com"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>Address
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="jalan raya kawali rt 01 rw 02 cibiru kawa"
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              multiline
              numberOfLines={3}
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>

          {/* Warning Text */}
          <Text style={styles.warningText}>
            The above information will be reviewed manually, please ensure the
            authenticity of the information. If you have any questions, please
            contact customer service in time.
          </Text>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  photoUploadBox: {
    flex: 1,
    height: 120,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  uploadText: {
    fontSize: 9,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#FF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 80,
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  warningText: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});
