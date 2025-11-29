// MyApp/src/screen/auth/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authAPI } from "../../utils/api";

export default function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phone || !password || !verifyCode) {
      Alert.alert("Error", "Harap isi semua field");
      return;
    }

    if (!checked) {
      Alert.alert("Error", "Harap setujui semua perjanjian");
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.register(phone.trim(), password.trim());
      if (result.success) {
        Alert.alert("Berhasil", "Registrasi berhasil!");
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Error", result.message || "Registrasi gagal");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#444" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Registrasi akun</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.linkTop}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Nomor Telepon */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="call-outline"
            size={22}
            color="#999"
            style={styles.icon}
          />
          <Text style={styles.prefix}>+62</Text>

          <TextInput
            placeholder="no hp"
            placeholderTextColor="#bbb"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            placeholder="kode sandi"
            placeholderTextColor="#bbb"
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Kode verifikasi */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={22}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            placeholder="masukkan nomor verifikasi"
            placeholderTextColor="#bbb"
            style={[styles.input, { flex: 1 }]}
            value={verifyCode}
            onChangeText={setVerifyCode}
          />

          {/* Button kode verifikasi */}
          <TouchableOpacity style={styles.verifyBtn}>
            <Text style={styles.verifyText}>kode verifikasi</Text>
          </TouchableOpacity>
        </View>

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setChecked(!checked)}
        >
          <Ionicons
            name={checked ? "checkbox-outline" : "square-outline"}
            size={22}
            color={checked ? "#63EEA2" : "#bbb"}
          />
          <Text style={styles.agreeText}>
            Saya telah membaca dan setuju
            <Text style={styles.link}> Perjanjian Pengguna</Text>,
            <Text style={styles.link}> Kebijakan Privasi</Text>,
            <Text style={styles.link}> Perjanjian Siaran Langsung</Text>
          </Text>
        </TouchableOpacity>

        {/* Button Registrasi */}
        <TouchableOpacity
          style={[
            styles.registerBtn,
            (!checked || loading) && styles.disabledBtn,
          ]}
          onPress={handleRegister}
          disabled={!checked || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerText}>Registrasi</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  content: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  linkTop: {
    color: "#19D6C8",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Input */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
  },

  icon: { marginRight: 10 },

  prefix: {
    color: "#444",
    marginRight: 10,
    fontSize: 15,
  },

  input: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },

  /* Verify Code Button */
  verifyBtn: {
    backgroundColor: "#19D6C8",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  verifyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Checkbox */
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  agreeText: {
    color: "#666",
    fontSize: 13,
    flex: 1,
    marginLeft: 10,
    lineHeight: 19,
  },

  link: {
    color: "#19D6C8",
  },

  /* Button Registrasi */
  registerBtn: {
    backgroundColor: "#19D6C8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    backgroundColor: "#BFEFEB",
  },

  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});