import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AgencyLogoUploadModal({
  isVisible,
  onClose,
  agencyId,
  onUploadSuccess,
}) {
  const [uploading, setUploading] = useState(false);
  const [slideAnim] = React.useState(new Animated.Value(400));

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const pickFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Izin Ditolak", "Anda perlu memberikan izin untuk mengakses galeri!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadLogo(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Izin Ditolak", "Anda perlu memberikan izin untuk mengakses kamera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadLogo(result.assets[0].uri);
    }
  };

  const uploadLogo = async (imageUri) => {
    setUploading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("logo", {
        uri: imageUri,
        type: "image/jpeg",
        name: "agency_logo.jpg",
      });

      const response = await api.post(
        `/agency/${agencyId}/upload-logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Berhasil", "Logo agency berhasil diperbarui!");
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data?.logo_url);
        }
        handleClose();
      } else {
        Alert.alert("Gagal", response.data.message || "Gagal mengupload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengupload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFA500" />
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          ) : (
            <>
              <View style={styles.handle} />

              <TouchableOpacity
                style={styles.option}
                onPress={takePhoto}
                disabled={uploading}
              >
                <Ionicons name="camera" size={24} color="#333" />
                <Text style={styles.optionText}>Kamera</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.option}
                onPress={pickFromGallery}
                disabled={uploading}
              >
                <Ionicons name="images" size={24} color="#333" />
                <Text style={styles.optionText}>Album</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.option}
                onPress={handleClose}
                disabled={uploading}
              >
                <Ionicons name="close" size={24} color="#FF1744" />
                <Text style={[styles.optionText, { color: "#FF1744" }]}>
                  Membatalkan
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
});
