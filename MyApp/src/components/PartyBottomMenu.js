import React, { useState, useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PartyBottomMenu({ active = "", onPress = () => {} }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Animasi skala tombol
  const scaleAnims = useRef({}).current;

  const handlePress = (id) => {
    if (!scaleAnims[id]) scaleAnims[id] = new Animated.Value(1);

    Animated.sequence([
      Animated.spring(scaleAnims[id], {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
        bounciness: 6,
      }),
      Animated.spring(scaleAnims[id], {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }),
    ]).start();

    if (id === "mic") setIsMicOn((prev) => !prev);
    else if (id === "sound") setIsSoundOn((prev) => !prev);

    onPress(id);
  };

  const menuItems = [
    { id: "chat", icon: "chatbubble-outline" },
    {
      id: "sound",
      icon: isSoundOn ? "volume-high-outline" : "volume-mute-outline",
    },
    { id: "mic", icon: isMicOn ? "mic-outline" : "mic-off-outline" },
    { id: "gift", icon: "gift-outline" },
    { id: "game", icon: "game-controller-outline" },
    { id: "emoji", icon: "happy-outline" },
    { id: "grid", icon: "grid-outline" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        {menuItems.map((item) => {
          const isActive =
            (item.id === "mic" && !isMicOn) ||
            (item.id === "sound" && !isSoundOn) ||
            active === item.id;

          if (!scaleAnims[item.id]) scaleAnims[item.id] = new Animated.Value(1);

          return (
            <TouchableWithoutFeedback
              key={item.id}
              onPress={() => handlePress(item.id)}
            >
              <Animated.View
                style={[
                  styles.iconWrap,
                  {
                    transform: [{ scale: scaleAnims[item.id] }],
                    shadowColor: isActive ? "#A8E6CF" : "#000",
                    shadowOpacity: isActive ? 0.8 : 0.4,
                    shadowRadius: isActive ? 8 : 4,
                    shadowOffset: { width: 0, height: 2 },
                  },
                ]}
              >
                <BlurView intensity={40} tint="dark" style={styles.blurCircle}>
                  <LinearGradient
                    colors={[
                      "rgba(255,255,255,0.18)",
                      "rgba(255,255,255,0.05)",
                      "rgba(0,0,0,0.2)",
                    ]}
                    style={styles.glassLayer}
                  />
                  <LinearGradient
                    colors={["rgba(255,255,255,0.35)", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.shineLayer}
                  />
                  <Ionicons
                    name={item.icon}
                    size={23}
                    color={isActive ? "#A8E6CF" : "#FFFFFF"}
                    style={{ opacity: isActive ? 1 : 0.9 }}
                  />
                </BlurView>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    zIndex: 99,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    marginBottom: Platform.OS === "ios" ? 10 : 4,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  blurCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1.3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 27,
  },
  shineLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 27,
    opacity: 0.25,
  },
});