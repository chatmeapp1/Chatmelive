// === src/screens/auth/LoginScreen.js ===
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CONFIG from "../../utils/config";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  // ✅ Animasi fade sederhana
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // ✅ GOOGLE LOGIN
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: CONFIG.GOOGLE_EXPO_CLIENT_ID,
    androidClientId: CONFIG.GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_IOS_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("✅ Google Auth:", response);

      const { authentication } = response;

      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          console.log("✅ USER:", user);
          await AsyncStorage.setItem("user", JSON.stringify(user));
          navigation.navigate("HomeScreen");
        })
        .catch((e) => console.log("ERROR:", e));
    }
  }, [response]);

  const handleGoogleLogin = () => {
    if (!request) return;
    promptAsync({ useProxy: true });
  };

  return (
    <LinearGradient
      colors={["#FFB6C1", "#63EEA2", "#B3FAD5"]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />

      <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
        <Image
          source={require("../../../assets/logo/chatme.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>{CONFIG.APP_NAME}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#db4a39" }]}
          onPress={handleGoogleLogin}
        >
          <FontAwesome name="google" size={22} color="#fff" />
          <Text style={styles.btnText}>Login dengan Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFFFFF" }]}
          onPress={() => navigation.navigate("PhoneLoginScreen")}
        >
          <Ionicons name="call-outline" size={22} color="#1E5631" />
          <Text style={[styles.btnText, { color: "#1E5631" }]}>Login via Nomor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.registerText}>Daftar Akun Baru</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { alignItems: "center", width: "80%" },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
    marginTop: 15,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#000",
  },
  registerText: {
    color: "#fff",
    marginTop: 15,
    fontWeight: "600",
  },
});