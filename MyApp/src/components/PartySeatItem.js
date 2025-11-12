import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function PartySeatItem({ seat, isSpeaking, onPress, activeEmoji }) { // ✅ tambah activeEmoji
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [displayedCoins, setDisplayedCoins] = useState(seat.user?.giftIncome || 0);

  // ✅ animasi emoji
  const emojiOpacity = useRef(new Animated.Value(0)).current;
  const emojiTranslate = useRef(new Animated.Value(0)).current;

  // 🔊 Efek Mic Glow halus
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [isSpeaking]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 215, 0, 0.15)", "rgba(255, 215, 0, 0.55)"],
  });

  // 🪙 Animasi count-up coin tiap perubahan giftIncome
  useEffect(() => {
    if (seat.user) {
      const newCoins = Math.floor(seat.user.giftIncome * 0.3); // potong 70%
      if (newCoins !== displayedCoins) {
        let start = displayedCoins;
        const diff = newCoins - start;
        const duration = 800;
        const step = 30;

        const increment = diff / (duration / step);
        const interval = setInterval(() => {
          start += increment;
          if ((increment > 0 && start >= newCoins) || (increment < 0 && start <= newCoins)) {
            start = newCoins;
            clearInterval(interval);
          }
          setDisplayedCoins(Math.floor(start));
        }, step);

        return () => clearInterval(interval);
      }
    }
  }, [seat.user?.giftIncome]);

  // ✨ animasi muncul emoji
  useEffect(() => {
    if (activeEmoji) {
      emojiOpacity.setValue(0);
      emojiTranslate.setValue(20);
      Animated.parallel([
        Animated.timing(emojiOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(emojiTranslate, {
          toValue: -40,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(emojiOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [activeEmoji]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.wrapper}>
        {/* === Avatar Area === */}
        {seat.locked ? (
          <View style={[styles.avatarFrame, styles.lockedFrame]}>
            <Ionicons name="lock-closed-outline" size={26} color="#fff" />
          </View>
        ) : seat.user ? (
          <View style={styles.avatarFrame}>
            {/* 🔥 Lottie Frame VIP */}
            {seat.user.hasFrame && (
              <LottieView
                source={require("../../assets/av_frame/lottie/Avatar_frame.json")}
                autoPlay
                loop
                style={styles.lottieFrame}
              />
            )}

            {/* 🔊 Mic Glow + Avatar */}
            <Animated.View
              style={[
                styles.avatarGlow,
                isSpeaking && {
                  backgroundColor: glowColor,
                  shadowColor: "#FFD700",
                  shadowOpacity: 1,
                  shadowRadius: 10,
                },
              ]}
            >
              <Image source={{ uri: seat.user.image }} style={styles.avatar} />
            </Animated.View>

            {/* 😄 Emoji animasi muncul di atas kursi */}
            {activeEmoji && (
              <Animated.View
                style={[
                  styles.emojiContainer,
                  {
                    opacity: emojiOpacity,
                    transform: [{ translateY: emojiTranslate }],
                  },
                ]}
              >
                <LottieView
                  source={activeEmoji}
                  autoPlay
                  loop={false}
                  style={{ width: 60, height: 60 }}
                />
              </Animated.View>
            )}
          </View>
        ) : (
          <View style={styles.avatarFrame}>
            <Ionicons name="person-circle-outline" size={40} color="#777" />
          </View>
        )}

        {/* === Seat Text & User === */}
        <Text style={styles.seatText}>Seat {seat.id}</Text>

        {seat.user && (
          <>
            <Text style={styles.username} numberOfLines={1}>
              {seat.user.name}
            </Text>

            {/* 💰 Animated Coin Value */}
            <Animated.Text style={styles.coinText}>
              {displayedCoins.toLocaleString("id-ID")}
            </Animated.Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    minHeight: 130,
  },
  avatarFrame: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieFrame: {
    position: "absolute",
    width: 90,
    height: 90,
    top: -10,
    left: -10,
    zIndex: 1,
  },
  avatarGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  emojiContainer: {
    position: "absolute",
    top: -50,
    alignSelf: "center",
    zIndex: 5,
  },
  lockedFrame: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  seatText: {
    color: "#bbb",
    fontSize: 11,
    marginTop: 4,
  },
  username: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    maxWidth: 70,
    textAlign: "center",
  },
  coinText: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});