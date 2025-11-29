
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

export default function LinkAjaScreen({ navigation }) {
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
    { id: 101, coins: "111,614", price: "Rp13,750" },
    { id: 102, coins: "202,935", price: "Rp25,000" },
    { id: 103, coins: "405,870", price: "Rp50,000" },
    { id: 104, coins: "608,805", price: "Rp75,000" },
    { id: 105, coins: "1,014,675", price: "Rp125,000" },
    { id: 106, coins: "2,029,350", price: "Rp250,000" },
    { id: 107, coins: "4,058,700", price: "Rp500,000" },
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

        <Text style={styles.headerTitle}>LinkAja</Text>

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
        <Text style={styles.coinsLabel}>My U Coins</Text>
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
              navigation.navigate("EwalletPaymentScreen", {
                ewalletInfo: { name: "LinkAja" }
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
