import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { scale } from "react-native-size-matters";

export default function PartySeatGrid({
  seats = [], // ✅ default agar tidak undefined
  speakingId = null,
  seatEmojis = {}, // ✅ aman biar tidak error
  onSeatPress = () => {},
}) {
  return (
    <View style={styles.container}>
      {seats.map((seat) => (
        <SeatItem
          key={seat.id}
          seat={seat}
          isSpeaking={speakingId === seat.id}
          emoji={seatEmojis ? seatEmojis[seat.id] : null} // ✅ aman check
          onPress={() => onSeatPress(seat)}
        />
      ))}
    </View>
  );
}

function SeatItem({ seat, isSpeaking, emoji, onPress }) {
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation;
    if (isSpeaking) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.08,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      glowAnim.stopAnimation(() => {
        glowAnim.setValue(1);
      });
    }
    return () => animation?.stop();
  }, [isSpeaking]);

  // === Jika kursi ada user ===
  return (
    <TouchableOpacity style={styles.seat} activeOpacity={0.8} onPress={onPress}>
      {seat?.user ? (
        <>
          {/* === Avatar User === */}
          <Animated.View
            style={[
              styles.avatarWrapper,
              isSpeaking && {
                transform: [{ scale: glowAnim }],
                shadowColor: "#FFD700",
                shadowOpacity: 0.9,
                shadowRadius: 10,
                elevation: 10,
              },
            ]}
          >
            <Image source={{ uri: seat.user.image }} style={styles.avatar} />
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
          </Animated.View>

          {/* === Nama User === */}
          <Text style={styles.nameText}>{seat.user.name || "User"}</Text>

          {/* === Gift Income Aman === */}
          <Text style={styles.income}>
            {(seat.user?.giftIncome ?? 0).toLocaleString("id-ID")}
          </Text>
        </>
      ) : (
        /* === Kursi kosong / locked === */
        <View
          style={[
            styles.emptySeat,
            seat.locked && { opacity: 0.6, backgroundColor: "#222" },
          ]}
        >
          {/* Kursi icon */}
          <View style={styles.centerIconWrapper}>
            <Image
              source={require("../../assets/sheat/sheat.png")}
              style={styles.seatIconEmpty}
              resizeMode="contain"
            />
          </View>

          {/* Nomor kursi */}
          <Text style={styles.seatNumber}>{seat.id}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(10),
  },
  seat: {
    width: "25%",
    alignItems: "center",
    marginVertical: scale(10),
  },
  avatarWrapper: {
    width: scale(63),
    height: scale(63),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "82%",
    height: "82%",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  emoji: {
    position: "absolute",
    bottom: scale(-22),
    fontSize: scale(22),
  },
  emptySeat: {
    width: scale(63),
    height: scale(63),
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerIconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -scale(23) }, { translateY: -scale(23) }],
    width: scale(46),
    height: scale(46),
    justifyContent: "center",
    alignItems: "center",
  },
  seatIconEmpty: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  nameText: {
    color: "#fff",
    fontSize: scale(12),
    marginTop: scale(4),
  },
  income: {
    color: "#FFD700",
    fontSize: scale(11),
    fontWeight: "600",
  },
  seatNumber: {
    color: "#fff",
    fontSize: scale(13),
    marginTop: scale(68),
    fontWeight: "500",
  },
});