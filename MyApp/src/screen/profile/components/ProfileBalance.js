import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

export default function ProfileBalance() {
  const navigation = useNavigation();
  const scale = new Animated.Value(1);

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

  return (
    <LinearGradient
      colors={["#2ecc71", "#6ee7b7", "#a7f3d0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceContainer}
    >
      <View style={styles.leftSection}>
        {/* === ICON COIN SVG === */}
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="11" fill="#FFD54F" stroke="#F9A825" strokeWidth="2" />
          <Path
            d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14.5L8 17L9.5 12.5L6 10H10.5L12 6Z"
            fill="#FBC02D"
          />
        </Svg>

        <Text style={styles.balanceText}>
          Saldo akun : <Text style={styles.balanceValue}>38</Text>
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("RechargeScreen")}
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