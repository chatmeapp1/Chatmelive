import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Dimensions, View } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function GiftLayer({ gift, onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height * 0.6)).current;

  useEffect(() => {
    if (gift) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: height * 0.25, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => onFinish?.());
    }
  }, [gift]);

  if (!gift) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {gift.lottie ? (
        <LottieView
          source={gift.lottie}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      ) : (
        <Image source={gift.src} style={styles.image} resizeMode="contain" />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height * 0.25,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  lottie: {
    width: width * 0.5,
    height: width * 0.5,
  },
  image: {
    width: width * 0.35,
    height: width * 0.35,
  },
});