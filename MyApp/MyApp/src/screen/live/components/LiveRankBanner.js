import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import coinBorder from "../../../../assets/decor/coinborder.png";

export default function LiveRankBanner({
  coins = 0,
  onPressRank,
  onPressCoin,
}) {
  const [seconds, setSeconds] = useState(0);

  // ✅ Timer berjalan tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Format ke jam:menit:detik
  const formatTime = () => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <View style={styles.row}>

      {/* ✅ COIN BANNER */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPressCoin}>
        <LinearGradient
          colors={["#37ff81", "#ff5050", "#ff9e3d"]}
          style={styles.coinBanner}
        >
          <Image source={coinBorder} style={styles.coinIcon} />
          <Text style={styles.coinText}>{coins}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ✅ RANK BANNER */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPressRank}>
        <LinearGradient
          colors={["#ff9e3d", "#ff7b00"]}
          style={styles.rankBanner}
        >
          <Ionicons name="flame" size={14} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.rankText}>Rank/Jam</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ✅ TIMER LIVE */}
      <View style={styles.timerBox}>
        <Ionicons name="time-outline" size={14} color="#fff" />
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "absolute",
    top: 150,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  coinBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },

  coinIcon: { width: 16, height: 16, marginRight: 5 },
  coinText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  rankBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },

  rankText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },

  timerText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
});