// LiveGiftEffectSide.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

export default function LiveGiftEffectSide({ gift }) {
  const [giftList, setGiftList] = useState([]);

  // SOUND
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

  // ADD GIFT TO LIST
  useEffect(() => {
    if (!gift) return;

    playSound();

    setGiftList((prev) => {
      // COMBO: Jika gift + user sama
      const existing = prev.find(
        (g) => g.username === gift.username && g.idKey === gift.id
      );

      if (existing) {
        existing.count += gift.count;
        return [...prev];
      }

      // ID tetap agar posisi stabil
      const idKey = gift.id + "-" + gift.username;

      return [
        ...prev,
        {
          ...gift,
          idKey,
          bubbleId: Date.now().toString() + Math.random().toString(36),
        },
      ];
    });

    // Auto clear bubble
    const timeout = setTimeout(() => {
      setGiftList((prev) => prev.filter((g) => g.idKey !== gift.id));
    }, 3500);

    return () => clearTimeout(timeout);
  }, [gift]);

  return (
    <View style={styles.container} pointerEvents="none">
      {giftList.map((g, index) => (
        <GiftBubble key={g.bubbleId} gift={g} index={index} />
      ))}
    </View>
  );
}

// ======================================================
// BUBBLE ITEM
// ======================================================
function GiftBubble({ gift, index }) {
  const slideX = useRef(new Animated.Value(-240)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.sequence([
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
      ]),
      Animated.delay(1600),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(slideX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const isJackpot = gift.jackpotAmount && gift.jackpotAmount > 0;

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
      {/* AVATAR */}
      <Image
        source={{ uri: gift.avatar || "https://picsum.photos/50" }}
        style={styles.avatar}
      />

      {/* USER NAME */}
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{gift.username}</Text>
        <Text style={styles.sentTo}>mengirim gift</Text>
      </View>

      {/* GIFT ICON */}
      {gift.lottie ? (
        <LottieView
          source={gift.lottie}
          autoPlay
          loop={false}
          style={styles.giftIcon}
        />
      ) : (
        <Image source={gift.src} style={styles.giftIcon} />
      )}

      {/* COMBO */}
      <Text style={styles.count}>x{gift.count}</Text>

      {/* JACKPOT ONLY */}
      {isJackpot && (
        <View style={styles.coinBox}>
          <Text style={styles.coinText}>+{gift.jackpotAmount}</Text>
        </View>
      )}
    </Animated.View>
  );
}

// ======================================================
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    width: "100%",
    height: 300,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -150,
  },

  bubble: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,15,15,0.78)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 45,
    width: "85%",
    borderWidth: 1.2,
    borderColor: "rgba(255,180,0,0.4)",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    marginRight: 8,
  },

  username: { color: "#fff", fontWeight: "700", fontSize: 13 },
  sentTo: { color: "#ccc", fontSize: 10, marginTop: -2 },

  giftIcon: { width: 38, height: 38, marginHorizontal: 4 },

  count: {
    color: "#00FF37",
    fontWeight: "900",
    fontSize: 18,
    marginHorizontal: 4,
  },

  coinBox: {
    backgroundColor: "#ff4275",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginLeft: 4,
  },

  coinText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
});