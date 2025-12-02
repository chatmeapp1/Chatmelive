import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function BigGiftEffect({ gift }) {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const [dimensions, setDimensions] = useState({ width: screenWidth, height: screenHeight });

  // Calculate responsive dimensions for luxury gifts
  const getResponsiveDimensions = () => {
    const maxWidth = screenWidth * 0.85; // 85% of screen width with padding
    const maxHeight = screenHeight * 0.75; // 75% of screen height with padding

    // Default to max available space
    return {
      width: Math.min(screenWidth, maxWidth),
      height: Math.min(screenHeight * 0.8, maxHeight),
    };
  };

  useEffect(() => {
    if (!gift || !gift.lottie) return;

    setVisible(true);
    
    // Set responsive dimensions for luxury gifts
    if (gift.category === "luxury") {
      setDimensions(getResponsiveDimensions());
    }

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
      <View style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
        <LottieView
          source={gift.lottie}
          autoPlay
          loop={false}
          style={styles.lottie}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});
