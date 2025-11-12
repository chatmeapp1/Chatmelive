// MyApp/src/screen/auth/SplashScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✨ Animasi muncul halus
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 30,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // ⏱️ Pindah otomatis ke LoginScreen setelah 2.5 detik
    const timer = setTimeout(() => {
      navigation.replace("LoginScreen");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FFB6C1", "#63EEA2", "#B3FAD5"]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Logo animasi */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require("../../../assets/logo/chatme.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Teks muncul perlahan */}
      <Animated.Text style={[styles.text, { opacity: textFade }]}>
        ChatMe — Setiap suara berarti 🎧
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginTop: 20,
    letterSpacing: 1,
  },
});