
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyTotalIncomeScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState({
    grandTotal: 0,
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    topEarners: [],
  });

  useEffect(() => {
    loadTotalIncome();
  }, []);

  const loadTotalIncome = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/total-income`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTotalData(response.data.data);
      }
    } catch (error) {
      console.error("Error loading total income:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#9AEC9A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9AEC9A" />

      <LinearGradient colors={["#9AEC9A", "#63EEA2"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Total Income</Text>
          <TouchableOpacity onPress={loadTotalIncome}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Grand Total Card */}
        <View style={styles.grandTotalCard}>
          <Text style={styles.grandTotalLabel}>Total Pendapatan Semua Host</Text>
          <Text style={styles.grandTotalValue}>{totalData.grandTotal.toLocaleString()}</Text>
          <Text style={styles.grandTotalCurrency}>Coins</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Stats */}
        <View style={styles.periodStats}>
          <View style={styles.periodCard}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.periodGradient}>
              <Text style={styles.periodLabel}>Hari Ini</Text>
              <Text style={styles.periodValue}>{totalData.todayTotal.toLocaleString()}</Text>
            </LinearGradient>
          </View>

          <View style={styles.periodCard}>
            <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.periodGradient}>
              <Text style={styles.periodLabel}>Minggu Ini</Text>
              <Text style={styles.periodValue}>{totalData.weekTotal.toLocaleString()}</Text>
            </LinearGradient>
          </View>

          <View style={styles.periodCard}>
            <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.periodGradient}>
              <Text style={styles.periodLabel}>Bulan Ini</Text>
              <Text style={styles.periodValue}>{totalData.monthTotal.toLocaleString()}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Top Earners */}
        <View style={styles.topEarnersSection}>
          <Text style={styles.sectionTitle}>Top Earners</Text>
          {totalData.topEarners?.map((host, index) => (
            <View key={index} style={styles.earnerCard}>
              <View style={styles.rankBadge}>
                <LinearGradient
                  colors={index === 0 ? ["#FFD700", "#FFA500"] : index === 1 ? ["#C0C0C0", "#808080"] : ["#CD7F32", "#8B4513"]}
                  style={styles.rankGradient}
                >
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </LinearGradient>
              </View>
              <View style={styles.earnerInfo}>
                <Text style={styles.earnerName}>{host.name}</Text>
                <Text style={styles.earnerId}>ID: {host.id}</Text>
              </View>
              <View style={styles.earnerAmount}>
                <Text style={styles.earnerValue}>{host.total_income.toLocaleString()}</Text>
                <Text style={styles.earnerCurrency}>Coins</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  grandTotalCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
    opacity: 0.9,
  },
  grandTotalValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  grandTotalCurrency: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  periodStats: {
    padding: 15,
    gap: 12,
  },
  periodCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  periodGradient: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  periodValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  topEarnersSection: {
    padding: 15,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  earnerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 15,
  },
  rankGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  earnerInfo: {
    flex: 1,
  },
  earnerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  earnerId: {
    fontSize: 12,
    color: "#666",
  },
  earnerAmount: {
    alignItems: "flex-end",
  },
  earnerValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  earnerCurrency: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
