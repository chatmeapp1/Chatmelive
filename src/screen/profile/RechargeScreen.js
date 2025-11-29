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
import api from "../../utils/api";
import getEnvVars from "../../utils/env";

export default function RechargeScreen({ navigation }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [snapUrl, setSnapUrl] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const { API_URL } = getEnvVars();
  const MIDTRANS_CLIENT_KEY = "SB-Mid-client-YOUR_CLIENT_KEY"; // Replace with your actual client key

  useEffect(() => {
    fetchPackages();
    fetchUserBalance();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/payment/packages");
      if (response.data.success) {
        // New API returns { bank: [], ewallet: [], all: [] }
        setPackages(response.data.data.all || response.data.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      Alert.alert("Error", "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setUserBalance(response.data.data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handlePayment = async (packageId) => {
    if (processing) return;

    setProcessing(true);
    setSelectedPackage(packageId);

    try {
      const response = await api.post("/payment/create-transaction", {
        packageId: packageId,
      });

      if (response.data.success) {
        const { snapToken } = response.data.data;

        // Open Snap payment page
        const snapUrl = `https://app.sandbox.midtrans.com/snap/v3/redirection/${snapToken}`;
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

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.status === "success") {
      setSnapUrl(null);
      Alert.alert(
        "Payment Successful",
        "Your coins have been added to your account!",
        [
          {
            text: "OK",
            onPress: () => {
              fetchUserBalance();
              navigation.goBack();
            },
          },
        ]
      );
    } else if (data.status === "pending") {
      setSnapUrl(null);
      Alert.alert("Payment Pending", "Your payment is being processed.");
    } else if (data.status === "error" || data.status === "cancel") {
      setSnapUrl(null);
      Alert.alert("Payment Failed", "Payment was cancelled or failed.");
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSnapUrl(null)}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSnapUrl(null)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>

        <WebView
          source={{ uri: snapUrl }}
          onMessage={handleWebViewMessage}
          injectedJavaScript={`
            window.addEventListener('message', function(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
            });
          `}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7CFCB5" />
      </View>
    );
  }

  const paymentMethods = [
    {
      id: 0,
      name: "Google Play",
      icon: "logo-google",
      subtitle: "International",
      bestChoice: false,
      screen: "GooglePlayBillingScreen",
    },
    {
      id: 1,
      name: "Bank BCA",
      logo: require("../../../assets/logo/bca.png"),
      subtitle: "Buy more Get more",
      bestChoice: true,
      screen: "BCAScreen",
    },
    {
      id: 2,
      name: "Bank Mandiri",
      logo: require("../../../assets/logo/mandiri.png"),
      subtitle: "Buy more Get more",
      bestChoice: true,
      screen: "MandiriScreen",
    },
    {
      id: 3,
      name: "Bank BRI",
      logo: require("../../../assets/logo/bri.png"),
      subtitle: "Buy more Get more",
      bestChoice: true,
      screen: "BRIScreen",
    },
    {
      id: 4,
      name: "BSS",
      logo: require("../../../assets/logo/bss.png"),
      subtitle: "Buy more Get more",
      bestChoice: true,
      screen: "BSSScreen",
    },
    {
      id: 5,
      name: "DANA",
      logo: require("../../../assets/logo/dana.png"),
      subtitle: "Indonesia",
      bestChoice: false,
      screen: "DANAScreen",
    },
    {
      id: 6,
      name: "OVO",
      logo: require("../../../assets/logo/ovo.png"),
      subtitle: "Indonesia",
      bestChoice: false,
      screen: "OVOScreen",
    },
    {
      id: 7,
      name: "GoPay",
      logo: require("../../../assets/logo/gopay.png"),
      subtitle: "Indonesia",
      bestChoice: false,
      screen: "GoPayScreen",
    },
    {
      id: 8,
      name: "LinkAja",
      logo: require("../../../assets/logo/link.png"),
      subtitle: "Indonesia",
      bestChoice: false,
      screen: "LinkAjaScreen",
    },
    {
      id: 9,
      name: "Shopee",
      logo: require("../../../assets/logo/shopee.png"),
      subtitle: "Indonesia",
      bestChoice: false,
      screen: "ShopeeScreen",
    },
  ];

  const handlePaymentMethod = (method) => {
    navigation.navigate(method.screen);
  };

  const CoinIcon = () => (
    <Image
      source={require("../../../assets/coin.png")}
      style={{ width: 70, height: 70, resizeMode: "contain" }}
    />
  );


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
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

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* My Coins Section */}
      <View style={styles.coinsSection}>
        <Text style={styles.coinsLabel}>My Coins</Text>
        <View style={styles.coinsRow}>
          <Text style={styles.coinsValue}>{userBalance}</Text>
          <CoinIcon />
        </View>
      </View>

      {/* Payment Methods Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.paymentCard}
            onPress={() => handlePaymentMethod(method)}
          >
            {method.bestChoice && (
              <View style={styles.bestChoiceBadge}>
                <Text style={styles.bestChoiceText}>Best Choice</Text>
              </View>
            )}

            <View style={styles.logoContainer}>
              {method.logo ? (
                <Image
                  source={method.logo}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name={method.icon} size={60} color="#7CFCB5" />
              )}
            </View>

            <Text style={styles.paymentName}>{method.name}</Text>
            <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8833d6",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
  scrollView: {
    flex: 1,
    backgroundColor: "#8833d6",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  coinsSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
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
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  gridContainer: {
    paddingHorizontal: 15,
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
  bonusBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#FF4081",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 1,
  },
  bonusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  coinIcon: {
    marginTop: 15,
    marginBottom: 10,
  },
  coinsAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  totalCoins: {
    fontSize: 12,
    color: "#FF4081",
    fontWeight: "600",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  buyButton: {
    backgroundColor: "#7CFCB5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 15,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  paymentCard: {
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
    minHeight: 160,
  },
  bestChoiceBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#FF4081",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 1,
  },
  bestChoiceText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  logoContainer: {
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  paymentLogo: {
    width: "100%",
    height: "100%",
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: "#8833d6",
    textAlign: "center",
  },
});