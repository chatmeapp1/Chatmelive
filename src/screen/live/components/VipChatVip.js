import React, { useRef, useEffect, memo } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { VIP_MAP } from "./vipMap";

const VipChatVip = memo(({
  username,
  message,
  avatar,
  vip = 1,
}) => {
  const config = VIP_MAP[vip] || VIP_MAP[1];

  // Animasi shimmer (jalan kiri → kanan)
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2600,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  // Animasi pulse glow (denyut)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animasi particle (bintang kecil)
  const particleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 1, 0.1],
  });
  const particleTranslateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  // Sedikit variasi untuk beberapa particle
  const particles = config.particleColors || [];

  return (
    <View style={styles.wrapper}>
      {/* Outer pulse glow */}
      <Animated.View
        style={[
          styles.pulseGlow,
          {
            shadowColor: config.glow,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.bubble,
          { borderColor: config.glow, shadowColor: config.glow },
        ]}
      >
        {/* Avatar */}
        <Image source={{ uri: avatar }} style={styles.avatar} />

        {/* Text area */}
        <View style={styles.textArea}>
          <View style={styles.row}>
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
            <View
              style={[
                styles.vipBadge,
                { backgroundColor: config.glow || "#fff" },
              ]}
            >
              <Text style={styles.vipText}>{config.label || `VIP ${vip}`}</Text>
            </View>
          </View>
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </View>

        {/* Shimmer highlight */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX: shimmerTranslateX }] },
          ]}
        >
          <LinearGradient
            colors={config.shimmer}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        {/* Particle spark (beberapa titik kecil) */}
        {particles.map((color, index) => (
          <Animated.View
            key={index}
            pointerEvents="none"
            style={[
              styles.particle,
              {
                backgroundColor: color,
                opacity: particleOpacity,
                transform: [
                  { translateY: particleTranslateY },
                  { translateX: (index - 1) * 12 }, // sebar sedikit
                ],
              },
            ]}
          />
        ))}
      </LinearGradient>
    </View>
  );
});

VipChatVip.displayName = "VipChatVip";

export default VipChatVip;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 2,
    position: "relative",

    // glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    marginRight: 10,
  },
  textArea: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    maxWidth: "70%",
  },
  message: {
    color: "#fdfdfd",
    fontSize: 13,
    marginTop: 4,
    opacity: 0.95,
  },
  vipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  vipText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 80,
    opacity: 0.55,
  },
  shimmerGradient: {
    flex: 1,
    borderRadius: 18,
  },
  particle: {
    position: "absolute",
    top: 8,
    right: 22,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pulseGlow: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
    bottom: 0,
    borderRadius: 22,
    shadowRadius: 26,
    shadowOpacity: 0.7,
    zIndex: -1,
  },
});
