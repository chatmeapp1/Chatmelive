// FloatingGiftCombo.js - Single bubble combo counter
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function FloatingGiftCombo({ activeCombo }) {
  const slideX = useRef(new Animated.Value(-300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const comboScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!activeCombo) {
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: -300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(slideX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();

    if (activeCombo.count > 1) {
      Animated.sequence([
        Animated.timing(comboScale, {
          toValue: 1.35,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(comboScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.7,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [activeCombo]);

  if (!activeCombo) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideX }, { scale }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      {/* MAIN BUBBLE */}
      <View style={styles.bubbleContainer}>
        <Animated.View
          style={[
            styles.glowBorder,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        <View style={styles.bubble}>
          <Image
            source={{ uri: activeCombo.avatar }}
            style={styles.avatar}
          />

          <View style={styles.textSection}>
            <Text style={styles.username} numberOfLines={1}>
              {activeCombo.username}
            </Text>
            <Text style={styles.giftText}>{activeCombo.giftName}</Text>
          </View>

          <View style={styles.rightSection}>
            {activeCombo.giftImage && (
              <Image
                source={
                  typeof activeCombo.giftImage === "number"
                    ? activeCombo.giftImage
                    : { uri: activeCombo.giftImage }
                }
                style={styles.giftIcon}
                resizeMode="contain"
              />
            )}

            <Animated.View
              style={[
                styles.comboCounter,
                {
                  transform: [{ scale: comboScale }],
                },
              ]}
            >
              <Text style={styles.comboText}>x{activeCombo.count}</Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 0,
    top: 80,

    // Bubble harus selalu di atas ChatList
    zIndex: 200,
    elevation: 200,

    pointerEvents: "none", // Supaya tidak memblok chat & tombol
  },

  bubbleContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 26,
  },

  glowBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#FFD700",
  },

  bubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.82)",
    borderRadius: 26,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#DAA520",
    minWidth: 280,
    maxWidth: width - 20,
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#444",
    borderWidth: 2,
    borderColor: "#FFD700",
  },

  textSection: {
    flex: 1,
    justifyContent: "center",
  },

  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },

  giftText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "500",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  giftIcon: {
    width: 38,
    height: 38,
  },

  comboCounter: {
    backgroundColor: "#00DD00",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#00DD00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },

  comboText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});