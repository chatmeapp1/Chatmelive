
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function ExchangeScreen({ navigation, route }) {
  const { diamonds: initialDiamonds } = route.params || {};
  const [diamonds, setDiamonds] = useState(initialDiamonds || 0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateCoins = () => {
    const diamondAmount = parseInt(amount) || 0;
    return Math.floor(diamondAmount * 0.3);
  };

  const handleExchange = async () => {
    const diamondAmount = parseInt(amount);

    if (!diamondAmount || diamondAmount <= 0) {
      Alert.alert("Error", "Masukkan jumlah diamond yang valid");
      return;
    }

    if (diamondAmount > diamonds) {
      Alert.alert("Error", "Diamond tidak mencukupi");
      return;
    }

    Alert.alert(
      "Konfirmasi Exchange",
      `Tukar ${diamondAmount.toLocaleString()} diamond menjadi ${calculateCoins().toLocaleString()} coin?\n\nKonversi: 30%`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Tukar",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.post("/income/exchange", {
                amount: diamondAmount,
              });

              if (response.data.success) {
                Alert.alert(
                  "Berhasil!",
                  `Anda mendapatkan ${response.data.received_coins.toLocaleString()} coin`,
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Exchange error:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Gagal melakukan exchange"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const quickAmounts = [1000, 5000, 10000, 50000];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B5F5B0", "#7EE6C7", "#5ED8E1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Exchange Diamond</Text>
          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Image
              source={require("../../../assets/icons/crystal.png")}
              style={styles.icon}
            />
            <View>
              <Text style={styles.balanceLabel}>Diamond Tersedia</Text>
              <Text style={styles.balanceValue}>{diamonds.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Exchange Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4DD179" />
          <Text style={styles.infoText}>
            Konversi rate: 1 Diamond = 0.3 Coin (30%)
          </Text>
        </View>

        {/* Input Amount */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Jumlah Diamond</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={require("../../../assets/icons/crystal.png")}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickBtn}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickBtnText}>
                  {quickAmount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conversion Preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Diamond</Text>
            <Text style={styles.previewValue}>
              {(parseInt(amount) || 0).toLocaleString()}
            </Text>
          </View>
          <Ionicons name="arrow-down" size={24} color="#4DD179" />
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Coin yang didapat</Text>
            <Text style={[styles.previewValue, { color: "#4DD179" }]}>
              {calculateCoins().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Exchange Button */}
        <TouchableOpacity
          style={[
            styles.exchangeBtn,
            loading && styles.exchangeBtnDisabled,
          ]}
          onPress={handleExchange}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.exchangeBtnText}>Exchange Sekarang</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 15,
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4CAF50",
  },
  infoCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    color: "#2E7D32",
    fontSize: 14,
    flex: 1,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4DD179",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F9F9F9",
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    paddingVertical: 15,
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  quickBtn: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  quickBtnText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 5,
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
  },
  previewValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  exchangeBtn: {
    backgroundColor: "#4DD179",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 3,
  },
  exchangeBtnDisabled: {
    backgroundColor: "#ccc",
  },
  exchangeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
