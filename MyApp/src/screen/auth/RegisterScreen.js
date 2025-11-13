// MyApp/src/screen/auth/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import getEnvVars from "../../utils/env";
const { API_URL } = getEnvVars();

export default function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = phone && password && code && checked;

  // 🔥 fungsi registrasi
  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);

      // Format nomor (hapus spasi, ubah +62 ke 0)
      let phoneNumber = phone.trim();
      if (phoneNumber.startsWith("+62")) phoneNumber = "0" + phoneNumber.slice(3);
      if (phoneNumber.startsWith("62") && !phoneNumber.startsWith("0"))
        phoneNumber = "0" + phoneNumber.slice(2);

      console.log("📤 Registrasi ke:", `${API_URL}/api/register`);
      console.log("📤 Data:", { phone: phoneNumber, password: "***" });

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, password }),
      });

      console.log("📥 Response status:", response.status);

      // Cek apakah response adalah JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Response bukan JSON:", text.substring(0, 200));
        Alert.alert("Error", "Server tidak merespons dengan benar. Pastikan server backend sudah jalan.");
        return;
      }

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (response.ok && data.success) {
        Alert.alert("Sukses", "Registrasi berhasil! Silakan login.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan saat registrasi");
      }
    } catch (err) {
      console.error("❌ Error registrasi:", err);
      Alert.alert(
        "Error",
        `Gagal terhubung ke server:\n${err.message}\n\nPastikan:\n1. Server backend sudah jalan\n2. URL API benar\n3. Koneksi internet OK`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#E8FFF3"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back-outline"
            size={26}
            color="#333"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Registrasi akun</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nomor HP */}
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="no hp"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="kode sandi"
              placeholderTextColor="#aaa"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Kode verifikasi */}
          <View style={styles.inputWrapper}>
            <Ionicons name="chatbubble-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="masukkan nomor verifikasi"
              placeholderTextColor="#aaa"
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.codeButton}>
              <Text style={styles.codeText}>kode verifikasi</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Registrasi */}
          <TouchableOpacity
            style={[styles.registerButton, { opacity: isFormValid ? 1 : 0.5 }]}
            disabled={!isFormValid || loading}
            onPress={handleRegister}
          >
            <LinearGradient
              colors={["#9AEC9A", "#63EEA2"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.registerText}>
                {loading ? "Mendaftar..." : "Registrasi"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setChecked(!checked)}
          >
            <Ionicons
              name={checked ? "checkbox-outline" : "square-outline"}
              size={20}
              color={checked ? "#63EEA2" : "#aaa"}
            />
            <Text style={styles.checkboxText}>
              Saya telah membaca dan setuju{" "}
              <Text style={styles.link}>Perjanjian Pengguna</Text>,{" "}
              <Text style={styles.link}>Kebijakan Privasi</Text>,{" "}
              <Text style={styles.link}>Perjanjian Siaran Langsung</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingVertical: 50, paddingHorizontal: 25 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  title: { fontSize: 22, fontWeight: "700", color: "#333", marginLeft: 10 },
  form: { marginTop: 10 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#333" },
  codeButton: {
    backgroundColor: "#63EEA2",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  codeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  registerButton: { marginTop: 20 },
  gradientButton: { borderRadius: 30, paddingVertical: 14, alignItems: "center" },
  registerText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 25,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    color: "#555",
    fontSize: 13,
    lineHeight: 18,
  },
  link: { color: "#9AEC9A", fontWeight: "600" },
});