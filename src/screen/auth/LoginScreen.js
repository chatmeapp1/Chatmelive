import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

import CONFIG from "../../utils/config";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: CONFIG.GOOGLE_EXPO_CLIENT_ID,
    androidClientId: CONFIG.GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_IOS_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1100,
      useNativeDriver: true,
    }).start();
  }, []);

  // Loop floating icons
  const float = (ref) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ref, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ref, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    float(float1);
    float(float2);
    float(float3);
  }, []);

  // Google Login
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          await AsyncStorage.setItem("userToken", authentication.accessToken);
          
          // Reset navigation to root - AppNavigator will detect token and show MainTabs
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Auth" }],
            })
          );
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
      colors={["#34ebc9", "#4f9cff", "#865bff"]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Floating Icons */}
      <Animated.Image
        source={require("../../../assets/decor/gift.png")}
        style={[styles.floatIcon, { top: 80, left: 30, transform: [{ translateY: float1 }] }]}
      />
      <Animated.Image
        source={require("../../../assets/decor/camera.png")}
        style={[styles.floatIcon, { top: 150, right: 30, transform: [{ translateY: float2 }] }]}
      />
      <Animated.Image
        source={require("../../../assets/decor/message.png")}
        style={[styles.floatIcon, { bottom: 100, alignSelf: "center", transform: [{ translateY: float3 }] }]}
      />

      {/* Main */}
      <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
        
        {/* Logo */}
        <Image
          source={require("../../../assets/logo/chatme.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>ChatMe Live</Text>

        {/* GOOGLE LOGIN */}
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
          <FontAwesome name="google" size={20} color="#fff" />
          <Text style={styles.googleText}>Masuk dengan Google</Text>
        </TouchableOpacity>

        {/* PHONE LOGIN */}
        <TouchableOpacity
          style={styles.phoneLoginBtn}
          onPress={() => navigation.navigate("PhoneLoginScreen")}
        >
          <FontAwesome name="phone" size={20} color="#fff" />
          <Text style={styles.phoneLoginText}>Login dengan Nomor Telepon</Text>
        </TouchableOpacity>

        {/* CREATE ACCOUNT */}
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

  center: { alignItems: "center", width: "80%", marginTop: 60 },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  appName: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  googleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 10,
  },

  phoneLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 25,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  phoneLoginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 10,
  },

  registerText: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
  },

  floatIcon: {
    width: 60,
    height: 60,
    opacity: 0.35,
    position: "absolute",
  },
});