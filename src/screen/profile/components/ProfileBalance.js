import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default function ProfileBalance({ navigation }) {
  const scale = new Animated.Value(1);
  const [topupBalance, setTopupBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const fetchUserBalance = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }

      const response = await api.get("/api/payment/user-balance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTopupBalance(response.data.data.topup_balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserBalance();
    }, [])
  );

  return (
    <LinearGradient
      colors={["#2ecc71", "#6ee7b7", "#a7f3d0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceContainer}
    >
      <View style={styles.leftSection}>
        <Image
          source={require("../../../../assets/coin.png")}
          style={{ width: 26, height: 26, resizeMode: "contain" }}
        />

        <View>
          <Text style={styles.balanceLabel}>Saldo Top-Up</Text>
          <Text style={styles.balanceText}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.balanceValue}>{topupBalance.toLocaleString("id-ID")}</Text>
            )}
          </Text>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("ProfileNavigator", { screen: "RechargeScreen" })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#16a34a", "#4ade80"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rechargeButton}
          >
            <Text style={styles.rechargeText}>Recharge</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    shadowColor: "#2ecc71",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceLabel: {
    fontWeight: "500",
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.9,
  },
  balanceText: {
    fontWeight: "600",
    color: "#ffffff",
    fontSize: 15,
  },
  balanceValue: {
    fontWeight: "700",
    color: "#fff",
  },
  rechargeButton: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 18,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  rechargeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});