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
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";

export default function BankPaymentScreen({ navigation, route }) {
  const bankInfo = route.params?.bankInfo || { name: "Bank Transfer", logo: null };
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snapUrl, setSnapUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchBankPackages();
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

  const fetchBankPackages = async () => {
    try {
      const response = await api.get("/payment/packages");
      if (response.data.success) {
        // Filter bank packages (id < 100)
        const bankPkgs = (response.data.data.bank || []).filter(pkg => pkg.id < 100);
        setPackages(bankPkgs);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (packageId) => {
    if (processing) return;
    setProcessing(true);

    try {
      const response = await api.post("/payment/create-transaction", {
        packageId: packageId,
      });

      if (response.data.success) {
        const { snapToken, orderId, coinsAmount, packagePrice } = response.data.data;
        setTransactionData({ orderId, coinsAmount, packagePrice });
        
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
        const snapUrl = isProduction
          ? `https://app.midtrans.com/snap/v3/redirection/${snapToken}`
          : `https://app.sandbox.midtrans.com/snap/v3/redirection/${snapToken}`;
        setSnapUrl(snapUrl);
      } else {
        Alert.alert("Error", response.data.message || "Failed to create transaction");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleWebViewNavigationStateChange = async (navState) => {
    console.log("🔍 WebView URL changed:", navState.url);
    
    const url = navState.url.toLowerCase();
    
    if (url.includes("midtrans") && (url.includes("finish") || url.includes("unfinish") || url.includes("error"))) {
      console.log("✅ Payment flow detected - checking transaction status");
      setCheckingStatus(true);
      
      setTimeout(async () => {
        if (transactionData?.orderId) {
          try {
            const token = await AsyncStorage.getItem("authToken");
            const statusResponse = await api.get(
              `/payment/check-status/${transactionData.orderId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("📊 Transaction status:", statusResponse.data);
            
            if (statusResponse.data.success && statusResponse.data.data?.status === "settlement") {
              console.log("🎉 Payment successful!");
              setSnapUrl(null);
              navigation.navigate("PaymentSuccessScreen", {
                transactionId: transactionData.orderId,
                coinsAmount: transactionData.coinsAmount,
                packagePrice: transactionData.packagePrice,
              });
            } else {
              console.log("⚠️ Payment not yet confirmed or failed");
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          } finally {
            setCheckingStatus(false);
          }
        }
      }, 2000);
    }
  };

  if (snapUrl) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#7CFCB5", "#A8E6CF", "#C8F4E3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => setSnapUrl(null)}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <TouchableOpacity onPress={() => setSnapUrl(null)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
        <WebView 
          source={{ uri: snapUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState={true}
        />
        {checkingStatus && (
          <View style={styles.statusOverlay}>
            <ActivityIndicator size="large" color="#7CFCB5" />
            <Text style={styles.statusText}>Verifying payment...</Text>
          </View>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#7CFCB5" />
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
        <Text style={styles.headerTitle}>{bankInfo.name}</Text>
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
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.packageCard}
              onPress={() => handlePayment(pkg.id)}
              disabled={processing}
            >
              <View style={styles.coinIconContainer}>
                <CoinIcon />
              </View>

              <Text style={styles.coinsAmount}>
                {(pkg.coins / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.coinsSubtext}>coins</Text>

              <Text style={styles.priceValue}>
                Rp{pkg.price.toLocaleString("id-ID")}
              </Text>

              <TouchableOpacity
                style={[styles.buyButton, processing && styles.buyButtonDisabled]}
                onPress={() => handlePayment(pkg.id)}
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
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 100,
  },
  statusText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
