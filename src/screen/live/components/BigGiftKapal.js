import React, { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

export default function BigGiftKapal({ trigger }) {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  // Play sound
  const playSound = async () => {
    try {
      soundRef.current = new Audio.Sound();
      await soundRef.current.loadAsync(require("../../../../assets/sfx/kapal_sound.mp3"));
      await soundRef.current.playAsync();
    } catch (err) {
      console.log("Sound error:", err);
    }
  };

  // Clean up sound
  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
    } catch {}
  };

  useEffect(() => {
    if (!trigger) return;

    setVisible(true);
    playSound();

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Close after animation
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        stopSound();
      });
    }, 4500); // animation duration
  }, [trigger]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.fullscreen, { opacity }]}>
      <LottieView
        source={require("../../../../assets/lottie/kapal_big_gift.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});