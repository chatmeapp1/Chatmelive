// src/screen/live/components/LiveSystemMessage.js
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const FRAME_IMAGES = {
  frame1: require("../../../../assets/frame1.png"),
  frame2: require("../../../../assets/frame2.png"),
  frame3: require("../../../../assets/frame3.png"),
};

export default function LiveSystemMessage({
  message = "Platform ini menganjurkan konten sehat",
  frame = null,
  onLayout,
  visible = true,
}) {
  // BATAS MAKSIMAL 20 KARAKTER
  const limitedMessage =
    message.length > 20 ? message.slice(0, 20) + "…" : message;

  // HANYA ANIMASI MASUK, TANPA KEDIP & TANPA HIDE
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // SELALU DITAMPILKAN (TIDAK ADA return null)
  // FRAME MODE
  if (frame && FRAME_IMAGES[frame]) {
    return (
      <Animated.View
        style={[
          styles.frameContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
        onLayout={onLayout}
      >
        <Image
          source={FRAME_IMAGES[frame]}
          style={styles.frameBackground}
          resizeMode="stretch"
        />
        <View style={styles.frameTextWrapper}>
          <Text style={styles.frameText} numberOfLines={3}>
            {limitedMessage}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // DEFAULT GRADIENT MODE (SOFT & CLASSY)
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
      onLayout={onLayout}
    >
      <BlurView intensity={45} style={styles.blurContainer}>
        <LinearGradient
          colors={[
            "rgba(147, 51, 234, 0.2)",
            "rgba(168, 85, 247, 0.15)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Ionicons
              name="megaphone-outline"
              size={15}
              color="rgba(255, 255, 255, 0.9)"
              style={styles.icon}
            />
            <Text style={styles.text} numberOfLines={1}>
              {limitedMessage}
            </Text>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    maxWidth: "88%",
    marginHorizontal: 20,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "rgba(147, 51, 234, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },

  // FRAME BANNER
  frameContainer: {
    alignSelf: "center",
    width: "85%",
    aspectRatio: 3,
    position: "relative",
  },
  frameBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  frameTextWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  frameText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 18,
  },
});