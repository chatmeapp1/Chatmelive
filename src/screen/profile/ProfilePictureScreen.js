import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../../utils/api";

export default function ProfilePictureScreen({ navigation }) {
  const [avatar, setAvatar] = useState(
    require("../../../assets/images/avatar_default.png")
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Izin ditolak", "Anda perlu memberikan izin untuk mengakses galeri!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Izin ditolak", "Anda perlu memberikan izin untuk mengakses kamera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert("Info", "Tidak ada perubahan untuk disimpan");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImage.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      });

      const response = await api.post("/auth/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Alert.alert("Berhasil", "Foto profil berhasil diperbarui!");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", response.data.message || "Gagal mengupload foto");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>gambar profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButton}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
        </View>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="images" size={24} color="#4CAF50" />
          <Text style={styles.buttonText}>Pilih dari Galeri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color="#4CAF50" />
          <Text style={styles.buttonText}>Ambil Foto</Text>
        </TouchableOpacity>
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
    fontWeight: "600",
    color: "#FFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: "85%",
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});