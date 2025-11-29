import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

export default function LiveGiftEffectSide({ gift }) {
  const [giftList, setGiftList] = useState([]);

  // Memainkan sound saat gift masuk
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../../assets/sounds/cring.mp3")
      );
      await sound.playAsync();
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  // Ketika ada gift dikirim dari modal
  useEffect(() => {
    if (!gift) return;

    const id = Date.now();
    const newGift = { id, ...gift };

    setGiftList((prev) => [...prev, newGift]);
    playSound();

    setTimeout(() => {
      setGiftList((prev) => prev.filter((g) => g.id !== id));
    }, 3500);
  }, [gift]);

  return (
    <View style={styles.container} pointerEvents="none">
      {giftList.map((g) => (
        <GiftBubble key={g.id} gift={g} />
      ))}
    </View>
  );
}

function GiftBubble({ gift }) {
  const slideX = useRef(new Animated.Value(-250)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      // ⭐ Masuk dari kiri
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: 20,
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
      ]),

      Animated.delay(1500),

      // ⭐ Keluar dengan fade + geser sedikit
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideX, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          transform: [{ translateX: slideX }, { scale }],
          opacity,
        },
      ]}
    >
      {/* Avatar sender */}
      <Image
        source={{ uri: gift.avatar || "https://picsum.photos/80" }}
        style={styles.avatar}
      />

      {/* Nama dan teks */}
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{gift.username || "User"}</Text>
        <Text style={styles.sentTo}>mengirim ke host</Text>
      </View>

      {/* Gift icon */}
      {gift.lottie ? (
        <LottieView source={gift.lottie} autoPlay loop={false} style={styles.giftIcon} />
      ) : (
        <Image source={gift.src} style={styles.giftIcon} />
      )}

      {/* Count */}
      <Text style={styles.count}>x{gift.count || 1}</Text>

      {/* Coin gained */}
      <View style={styles.coinBox}>
        <Text style={styles.coinText}>+{(gift.price || 0) * (gift.count || 1)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 150,
    left: 0,
    width: "100%",
    zIndex: 2000,
  },

  bubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,20,20,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 40,
    marginVertical: 6,
    marginLeft: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,200,0,0.4)",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 22,
    marginRight: 10,
  },

  username: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  sentTo: {
    color: "#ccc",
    fontSize: 11,
  },

  giftIcon: {
    width: 42,
    height: 42,
    marginHorizontal: 8,
  },

  count: {
    color: "#00FF37",
    fontWeight: "900",
    fontSize: 20,
    marginHorizontal: 6,
  },

  coinBox: {
    backgroundColor: "#ff4275",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  coinText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});