// src/live/components/LiveGiftEffect.js

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";

export default function LiveGiftEffect({ trigger }) {
  const [gifts, setGifts] = useState([]);

  // Ketika trigger berubah → tambahkan gift baru
  useEffect(() => {
    if (trigger === 0) return;

    const id = Date.now();
    setGifts((prev) => [...prev, { id }]);

    // Hapus gift setelah animasi selesai
    setTimeout(() => {
      setGifts((prev) => prev.filter((g) => g.id !== id));
    }, 1800);
  }, [trigger]);

  return (
    <View pointerEvents="none" style={styles.container}>
      {gifts.map((gift) => (
        <FloatingGift key={gift.id} />
      ))}
    </View>
  );
}

function FloatingGift() {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.giftBubble,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Image
        source={{ uri: "https://pngimg.com/uploads/rose/rose_PNG669.png" }}
        style={styles.giftIcon}
      />
      <Text style={styles.giftText}>+10</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  giftBubble: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginVertical: 6,
    alignItems: "center",
  },

  giftIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 8,
  },

  giftText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});