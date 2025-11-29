import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNIap from "react-native-iap";
import api from "../../../utils/api";

// Google Play product IDs - Match your Google Play Console
const GOOGLE_PLAY_SKUS = [
  "coins_small",      // Smallest package
  "coins_medium",     // Medium package
  "coins_large",      // Large package
  "coins_xlarge",     // XL package
  "coins_mega",       // Mega package
];

const GOOGLE_PLAY_PACKAGES = [
  { id: "coins_small", coins: 111614, price: 13750, displayPrice: "Rp13.750", sku: "coins_small" },
  { id: "coins_medium", coins: 405870, price: 50000, displayPrice: "Rp50.000", sku: "coins_medium" },
  { id: "coins_large", coins: 1014675, price: 125000, displayPrice: "Rp125.000", sku: "coins_large" },
  { id: "coins_xlarge", coins: 2029350, price: 250000, displayPrice: "Rp250.000", sku: "coins_xlarge" },
  { id: "coins_mega", coins: 4058700, price: 500000, displayPrice: "Rp500.000", sku: "coins_mega" },
];

export default function GooglePlayBillingScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    initIAP();
    fetchUserBalance();
    return () => {
      endIAPConnection();
    };
  }, []);

  const initIAP = async () => {
    try {
      console.log("🔄 Initializing IAP...");
      await RNIap.initConnection();
      setConnected(true);
      console.log("✅ IAP Connected");
      
      // Fetch products
      const prods = await RNIap.getProducts({ skus: GOOGLE_PLAY_SKUS });
      console.log("📦 Products fetched:", prods);
      setProducts(prods);
    } catch (error) {
      console.error("❌ IAP Init error:", error);
      Alert.alert("Error", "Failed to connect to Google Play Store");
    } finally {
      setLoading(false);
    }
  };

  const endIAPConnection = async () => {
    try {
      await RNIap.endConnection();
    } catch (error) {
      console.error("Error ending IAP connection:", error);
    }
  };

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

  const handlePurchase = async (productId) => {
    if (processing || !connected) return;
    setProcessing(true);

    try {
      console.log(`💳 Starting purchase for: ${productId}`);
      
      // Request purchase from Google Play
      const purchase = await RNIap.requestPurchase({ skus: [productId] });
      console.log("📱 Purchase initiated:", purchase);

      if (purchase && purchase.transactionReceipt) {
        // Verify receipt with backend
        await verifyAndProcessReceipt(purchase, productId);
      }
    } catch (error) {
      console.error("❌ Purchase error:", error);
      if (error.code !== "E_USER_CANCELLED") {
        Alert.alert("Error", "Failed to process purchase");
      }
    } finally {
      setProcessing(false);
    }
  };

  const verifyAndProcessReceipt = async (purchase, productId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      // Send receipt to backend for verification
      const response = await api.post(
        "/payment/verify-gplay-receipt",
        {
          productId: productId,
          receipt: purchase.transactionReceipt,
          packageData: purchase.packageNameAndroid || "",
          signature: purchase.signatureAndroid || "",
          transactionId: purchase.transactionId || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log("✅ Payment verified and coins added!");
        
        // Finish transaction
        await RNIap.finishTransaction({ purchase, isConsumable: true });
        
        // Refresh balance
        await fetchUserBalance();
        
        // Show success
        const pkg = GOOGLE_PLAY_PACKAGES.find(p => p.sku === productId);
        Alert.alert(
          "Success!",
          `You've received ${pkg.coins.toLocaleString()} coins!`,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", response.data.message || "Payment verification failed");
        await RNIap.finishTransaction({ purchase, isConsumable: true });
      }
    } catch (error) {
      console.error("❌ Receipt verification error:", error);
      Alert.alert("Error", "Failed to verify payment");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#7CFCB5" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading products...</Text>
      </View>
    );
  }

  if (!connected) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#7CFCB5", "#A8E6CF", "#C8F4E3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Google Play</Text>
          <View style={{ width: 28 }} />
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to connect to Google Play Store</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={initIAP}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const CoinIcon = () => (
    <Image
      source={require("../../../../assets/coin.png")}
      style={{ width: 50, height: 50, resizeMode: "contain" }}
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Play</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={["#7CFCB5", "#A8E6CF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.myCoinsSection}
      >
        <Text style={styles.coinsLabel}>My Coins</Text>
        <View style={styles.coinsRow}>
          <Text style={styles.coinsValue}>{userBalance.toLocaleString("id-ID")}</Text>
          <CoinIcon />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.packagesContainer}>
          {GOOGLE_PLAY_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.sku}
              style={styles.packageCard}
              onPress={() => handlePurchase(pkg.sku)}
              disabled={processing}
            >
              <View style={styles.coinIconContainer}>
                <CoinIcon />
              </View>

              <Text style={styles.coinsAmount}>
                {(pkg.coins / 1000000).toFixed(2)}M
              </Text>
              <Text style={styles.coinsSubtext}>coins</Text>

              <Text style={styles.priceValue}>
                {pkg.displayPrice}
              </Text>

              <TouchableOpacity
                style={[styles.buyButton, processing && styles.buyButtonDisabled]}
                onPress={() => handlePurchase(pkg.sku)}
                disabled={processing}
              >
                <Text style={styles.buyButtonText}>
                  {processing ? "Processing..." : "Buy"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    width: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#8833d6",
  },
  packagesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  packageCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  coinIconContainer: {
    marginBottom: 10,
  },
  coinsAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  coinsSubtext: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4081",
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: "#7CFCB5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },
  myCoinsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  coinsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  coinsValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#7CFCB5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },
});
