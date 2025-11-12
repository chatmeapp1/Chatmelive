import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function FeedbackScreen({ navigation }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    setLoading(true);

    // simulasi pengiriman ke server
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* Header Transparan */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Umpan balik</Text>
        </View>

        {/* Konten */}
        <View style={styles.content}>
          <Text style={styles.label}>Konten umpan balik</Text>

          <BlurView intensity={40} tint="dark" style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Jelaskan masalah dan situasi Anda secara rinci, terima kasih atas komentar Anda yang berharga .."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={feedback}
              onChangeText={setFeedback}
            />
          </BlurView>

          {/* Tombol Kirim */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.9}
            disabled={loading}
          >
            <LinearGradient
              colors={["#a46bff", "#8a9eff", "#63ffd6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Kirimkan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal Loading */}
        <Modal transparent visible={loading} animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Memuat...</Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  content: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  inputWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  input: {
    height: 150,
    textAlignVertical: "top",
    padding: 12,
    fontSize: 14,
    color: "#fff",
  },
  submitButton: {
    marginTop: 25,
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8a9eff",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: "rgba(20,20,20,0.85)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: "rgba(255,255,255,0.08)",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
    opacity: 0.9,
  },
});