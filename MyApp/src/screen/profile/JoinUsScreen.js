import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function JoinUsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* === Header Hijau Pastel === */}
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

          <Text style={styles.headerText}>Join Us</Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* === Banner Ungu ke Merah Muda === */}
      <LinearGradient
        colors={["#7C3AED", "#A855F7", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerContainer}
      >
        <Text style={styles.bannerTitle}>Join Us</Text>
      </LinearGradient>

      {/* === Card Menu Apply === */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ApplyAgency")}
        >
          <Text style={styles.menuText}>Apply for Agency</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ApplyHost")}
        >
          <Text style={styles.menuText}>Apply for Host</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F8" },

  // === Header ===
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // === Banner ===
  bannerContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 20,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // === Menu Apply ===
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -20,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: "#E5E5E5",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});