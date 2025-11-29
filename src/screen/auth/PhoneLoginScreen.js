import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import getEnvVars from "../../utils/env";

const { API_URL } = getEnvVars();

export default function PhoneLoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Nomor telepon dan sandi wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // Format nomor
      let phoneNumber = phone.trim();
      if (phoneNumber.startsWith("+62")) phoneNumber = "0" + phoneNumber.slice(3);
      if (phoneNumber.startsWith("62") && !phoneNumber.startsWith("0"))
        phoneNumber = "0" + phoneNumber.slice(2);

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));

        // Tunggu sebentar agar AppNavigator mendeteksi token
        setTimeout(() => {
          setLoading(false);
        }, 300);

      } else {
        Alert.alert("Login Gagal", data.message || "Nomor atau sandi salah");
      }
    } catch (err) {
      Alert.alert("Error", `Tidak dapat terhubung ke server:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFB6C1", "#63EEA2", "#B3FAD5"]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image
            source={require("../../../assets/logo/chatme.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>ChatMe</Text>
          <Text style={styles.subtitle}>Menghubungkan hati dan menjembatani jarak</Text>

          <View style={styles.formBox}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>+62</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Masukkan nomor telepon"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan kata sandi"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.inputFull}
            />

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Masuk</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.linkText}>SMS Login</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.linkText}>Lupa kata sandi?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
    paddingTop: StatusBar.currentHeight || 60,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  logo: { width: 130, height: 130, marginTop: 10 },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E5631",
    marginTop: 5,
  },
  subtitle: { fontSize: 14, color: "#444", marginBottom: 25 },
  formBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
  },
  prefix: { fontSize: 16, color: "#444", fontWeight: "600", marginRight: 6 },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  inputFull: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    height: 45,
    fontSize: 15,
    color: "#333",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: "#FF66C4",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  linkText: {
    color: "#6A5ACD",
    fontSize: 13,
    fontWeight: "600",
  },
});