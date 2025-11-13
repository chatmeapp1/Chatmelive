
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

export default function RechargeScreen({ navigation }) {
  const paymentMethods = [
    {
      id: 1,
      name: "Bank BCA",
      subtitle: "Buy more Get more",
      logo: require("../../../../assets/logo/bca.png"),
      bestChoice: true,
    },
    {
      id: 2,
      name: "Bank Mandiri",
      subtitle: "Buy more Get more",
      logo: require("../../../../assets/logo/mandiri.png"),
      bestChoice: true,
    },
    {
      id: 3,
      name: "Bank BRI",
      subtitle: "Buy more Get more",
      logo: require("../../../../assets/logo/bri.png"),
      bestChoice: true,
    },
    {
      id: 4,
      name: "BSS",
      subtitle: "Buy more Get more",
      logo: require("../../../../assets/logo/bss.png"),
      bestChoice: true,
    },
    {
      id: 5,
      name: "DANA",
      subtitle: "Indonesia",
      logo: require("../../../../assets/logo/dana.png"),
      bestChoice: false,
    },
    {
      id: 6,
      name: "OVO",
      subtitle: "Indonesia",
      logo: require("../../../../assets/logo/ovo.png"),
      bestChoice: false,
    },
    {
      id: 7,
      name: "GoPay",
      subtitle: "Indonesia",
      logo: require("../../../../assets/logo/gopay.png"),
      bestChoice: false,
    },
    {
      id: 8,
      name: "LinkAja",
      subtitle: "Indonesia",
      logo: require("../../../../assets/logo/link.png"),
      bestChoice: false,
    },
    {
      id: 9,
      name: "Shopee",
      subtitle: "Indonesia",
      logo: require("../../../../assets/logo/shopee.png"),
      bestChoice: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
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

        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* My U Coins Section */}
      <LinearGradient
        colors={["#7CFCB5", "#A8E6CF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.coinsSection}
      >
        <Text style={styles.coinsLabel}>My U Coins</Text>
        <View style={styles.coinsRow}>
          <Text style={styles.coinsValue}>38</Text>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="11" fill="#FFD54F" stroke="#F9A825" strokeWidth="2" />
            <Path
              d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14.5L8 17L9.5 12.5L6 10H10.5L12 6Z"
              fill="#FBC02D"
            />
          </Svg>
        </View>
      </LinearGradient>

      {/* Payment Methods Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
      >
        {paymentMethods.map((method) => (
          <TouchableOpacity key={method.id} style={styles.card}>
            {method.bestChoice && (
              <View style={styles.bestChoiceBadge}>
                <Text style={styles.bestChoiceText}>Best Choice</Text>
              </View>
            )}

            <View style={styles.logoContainer}>
              <Image source={method.logo} style={styles.logo} />
            </View>

            <Text style={styles.methodName}>{method.name}</Text>
            <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7CFCB5",
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
    backgroundColor: "#7CFCB5",
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
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 11,
    fontWeight: "700",
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginTop: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  methodName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  methodSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
