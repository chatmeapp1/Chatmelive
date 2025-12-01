// src/screen/live/components/LiveRankBanner.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IncomeHostBubble from "./IncomeHostBubble";
import coinBorder from "../../../../assets/decor/coinborder.png";

export default function LiveRankBanner({
  coins = 0,
  hostId,
  isHost = false,
}) {
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(0);

  // TIMER only (HOST ONLY)
  useEffect(() => {
    if (!isHost) return; // Only run timer for host
    
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isHost]);

  const formatTime = () => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Hide timer for viewers - only show for host
  if (!isHost) {
    return null;
  }

  return (
    <View style={styles.row}>

      {/* INCOME HOST BUBBLE - Separated Component */}
      <IncomeHostBubble coins={coins} hostId={hostId} />

      {/* RANK */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (hostId) navigation.navigate("FansRankingScreen", { hostId });
        }}
      >
        <View style={styles.rankBanner}>
          <Image source={require("../../../../assets/coin.png")} style={styles.rankIcon} />
          <Text style={styles.rankText}>Rank/Jam</Text>
        </View>
      </TouchableOpacity>

      {/* TIMER */}
      <View style={styles.timerBox}>
        <Ionicons name="time" size={13} color="#fff" />
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "absolute",
    top: 115,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  rankBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "rgba(120, 113, 130, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  rankIcon: { width: 14, height: 14, marginRight: 5 },
  rankText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(120, 113, 130, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  timerText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "600",
  },
});