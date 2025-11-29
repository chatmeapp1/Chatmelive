import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path, G } from "react-native-svg";
import LottieView from "lottie-react-native";

export default function PaymentSuccessScreen({ navigation, route }) {
  const {
    transactionId = "TXN-XXXXXX",
    coinsAmount = 0,
    packagePrice = 0,
  } = route.params || {};

  const formattedCoins =
    coinsAmount >= 1000000
      ? (coinsAmount / 1000000).toFixed(1) + "M"
      : coinsAmount >= 1000
      ? (coinsAmount / 1000).toFixed(0) + "K"
      : coinsAmount.toString();

  const handleBackToProfile = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "ProfileScreen" }],
    });
  };

  const SuccessCheckmark = () => (
    <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="55" fill="#7CFCB5" opacity="0.2" />
      <Circle cx="60" cy="60" r="50" fill="none" stroke="#7CFCB5" strokeWidth="3" />
      <G>
        {/* Checkmark */}
        <Path
          d="M35 60L50 75L85 40"
          stroke="#7CFCB5"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  );

  const CoinIcon = () => (
    <Image
      source={require("../../../../assets/coin.png")}
      style={{ width: 60, height: 60, resizeMode: "contain" }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#7CFCB5", "#A8E6CF", "#C8F4E3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment Successful</Text>
          <Text style={styles.headerSubtitle}>Coins added to your account</Text>
        </View>

        {/* Success Animation/Icon */}
        <View style={styles.successIconContainer}>
          <SuccessCheckmark />
        </View>

        {/* Coins Display */}
        <View style={styles.coinsDisplayCard}>
          <View style={styles.coinsContent}>
            <CoinIcon />
            <Text style={styles.coinsCountBig}>{formattedCoins}</Text>
            <Text style={styles.coinsLabel}>Coins Received</Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          {/* Transaction ID */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="receipt" size={20} color="#7CFCB5" />
              <Text style={styles.detailLabel}>Transaction ID</Text>
            </View>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>

          {/* Amount Paid */}
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="cash" size={20} color="#7CFCB5" />
              <Text style={styles.detailLabel}>Amount Paid</Text>
            </View>
            <Text style={styles.detailValue}>
              Rp{packagePrice.toLocaleString("id-ID")}
            </Text>
          </View>

          {/* Status */}
          <View style={[styles.detailRow, styles.statusRow]}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#7CFCB5" />
              <Text style={styles.detailLabel}>Status</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#7CFCB5" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Payment Completed</Text>
            <Text style={styles.infoDescription}>
              Your coins have been successfully added to your account. You can use them to send
              gifts or recharge VIP membership.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToProfile}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#7CFCB5", "#A8E6CF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.backButtonText}>Back to Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </LinearGradient>
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
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 140,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0F7F4",
    fontWeight: "500",
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  coinsDisplayCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  coinsContent: {
    alignItems: "center",
  },
  coinsCountBig: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFD54F",
    marginVertical: 12,
    textShadowColor: "#F9A825",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coinsLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
    textAlign: "right",
  },
  statusRow: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: "rgba(124, 252, 181, 0.1)",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#7CFCB5",
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7CFCB5",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    fontWeight: "400",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(136, 51, 214, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
