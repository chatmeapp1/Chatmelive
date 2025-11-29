import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import LottieView from "lottie-react-native";

export default function BigGiftEffect({ gift }) {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;


  useEffect(() => {
    if (!gift || !gift.lottie) return;

    setVisible(true);

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto remove effect
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, gift.duration || 4000); // default 4s animation
  }, [gift]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <LottieView
        source={gift.lottie}
        autoPlay
        loop={false}
        style={styles.lottie}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)", // efek gelap
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});