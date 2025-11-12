import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeBanner() {
  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: "https://i.ibb.co/0yM5mMy/live-banner-green.jpg" }}
        style={styles.bannerImage}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "transparent"]}
        style={styles.bannerOverlay}
      />
      <Text style={styles.bannerText}>🎉 Event Minggu Ini — Dapatkan Bonus!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    height: 110,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerText: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});