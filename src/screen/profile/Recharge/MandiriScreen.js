
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../utils/api";

export default function MandiriScreen({ navigation }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setUserBalance(response.data.data.topup_balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const packages = [
    { id: 1, coins: "1,140,400", price: "Rp142,000" },
    { id: 2, coins: "2,324,000", price: "Rp284,000" },
    { id: 3, coins: "11,752,800", price: "Rp1,420,000" },
    { id: 4, coins: "23,538,800", price: "Rp2,840,000" },
    { id: 5, coins: "47,069,300", price: "Rp5,675,000" },
    { id: 6, coins: "93,756,800", price: "Rp11,300,000" },
    { id: 7, coins: "117,204,300", price: "Rp14,125,000" },
  ];

  const CoinIcon = () => (
    <Image
      source={require("../../../../assets/coin.png")}
      style={{ width: 40, height: 40, resizeMode: "contain" }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#7CFCB5", "#A8E6CF", "#C8F4E3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Recharge</Text>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("ProfileScreen")}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={["#7CFCB5", "#A8E6CF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.coinsSection}
      >
        <Text style={styles.coinsLabel}>My Coins</Text>
        <View style={styles.coinsRow}>
          <Text style={styles.coinsValue}>{userBalance.toLocaleString("id-ID")}</Text>
          <CoinIcon />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
      >
        {packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.card,
              selectedAmount === pkg.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedAmount(pkg.id)}
          >
            <CoinIcon />
            <Text style={styles.coinsText}>{pkg.coins}</Text>
            <Text style={styles.priceText}>{pkg.price}</Text>
            {selectedAmount === pkg.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedAmount && styles.confirmButtonDisabled,
          ]}
          disabled={!selectedAmount}
          onPress={() => {
            if (selectedAmount) {
              navigation.navigate("BankPaymentScreen", {
                bankInfo: { name: "Bank Mandiri" }
              });
            }
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8833d6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    paddingHorizontal: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  coinsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  coinsLabel: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  coinsValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },

  scrollView: {
    flex: 1,
  },

  gridContainer: {
    padding: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#7CFCB5",
  },

  coinsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },

  priceText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  checkmark: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#7CFCB5",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomSection: {
    padding: 20,
    backgroundColor: "#8833d6",
  },

  confirmButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  confirmButtonDisabled: {
    opacity: 0.5,
  },

  confirmText: {
    color: "#8833d6",
    fontSize: 16,
    fontWeight: "700",
  },
});
