// src/screen/live/components/IncomeHostBubble.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../../utils/api";

export default function IncomeHostBubble({ coins = 0, hostId }) {
  const navigation = useNavigation();
  const [liveIncome, setLiveIncome] = useState(0);

  // Fetch live income per jam
  useEffect(() => {
    if (!hostId) return;

    const fetchLiveIncome = async () => {
      try {
        const response = await api.get(`/income/live-current/${hostId}`);
        if (response.data.success) {
          setLiveIncome(response.data.income);
        }
      } catch (error) {
        console.log("Error fetching live income:", error.message);
      }
    };

    // Fetch immediately
    fetchLiveIncome();

    // Fetch every 5 seconds
    const incomeInterval = setInterval(fetchLiveIncome, 5000);

    return () => clearInterval(incomeInterval);
  }, [hostId]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (hostId) navigation.navigate("CoinDetailScreen", { hostId });
      }}
    >
      <View style={styles.coinBanner}>
        <Image 
          source={require("../../../../assets/coin.png")} 
          style={styles.coinIcon} 
        />
        <Text style={styles.coinText}>{liveIncome || coins}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  coinBanner: {
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
  coinIcon: { width: 16, height: 16, marginRight: 5 },
  coinText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});
