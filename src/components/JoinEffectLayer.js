import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import JoinEffect from "./JoinEffect";
import LottieView from "lottie-react-native";

/**
 * Layer global untuk animasi user join
 * muncul di atas semua UI lain
 */
export default function JoinEffectLayer({ activeUser }) {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (activeUser) {
      setUser(activeUser);
      setVisible(true);

      // Sembunyikan otomatis setelah 6 detik
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [activeUser]);

  if (!visible || !user) return null;

  return (
    <View style={styles.layer}>
      {/* 🌟 Efek Banner Join */}
      <JoinEffect
        visible={visible}
        user={user}
        onFinish={() => setVisible(false)}
      />

      {/* 🏍️ Efek Motor Masuk */}
      <LottieView
        source={require("../../assets/epect_masuk/motor.json")}
        autoPlay
        loop={false}
        style={styles.motorEffect}
        resizeMode="contain"
        onAnimationFinish={() => console.log("🎞️ Animasi motor selesai")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: "none", // biar gak ganggu tombol lain
    alignItems: "center",
    justifyContent: "center",
  },
  motorEffect: {
    position: "absolute",
    bottom: "20%", // muncul dari bawah
    width: 300,
    height: 300,
  },
});