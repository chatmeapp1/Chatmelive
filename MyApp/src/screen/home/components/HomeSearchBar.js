import React, { useRef } from "react";
import {
  Animated,
  View,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeSearchBar() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animasi transformasi
  const translateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -15],
    extrapolate: "clamp",
  });

  const scale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.wrapper}>
      {/* Animated Search Bar */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#444"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="Cari host, event, atau room..."
          placeholderTextColor="#888"
        />
      </Animated.View>

      {/* Scroll Listener (dummy) */}
      <Animated.ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ height: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 45,
    marginHorizontal: 16,
    marginBottom: 12,

    // ✨ Shadow Neon hijau lembut
    shadowColor: "#00FFAA",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,

    borderWidth: 0.3,
    borderColor: "rgba(0, 255, 120, 0.25)",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    fontWeight: "400",
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
  },
  scrollArea: {
    position: "absolute",
    width,
    height: "100%",
    opacity: 0, // tak terlihat, hanya untuk trigger animasi
  },
});