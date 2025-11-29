
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyHostIncomeScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("daily"); // daily, weekly, monthly
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    loadIncomeData();
  }, [period]);

  const loadIncomeData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/income/${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setIncomeData(response.data.data);
      }
    } catch (error) {
      console.error("Error loading income data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderIncomeItem = ({ item }) => (
    <View style={styles.incomeCard}>
      <View style={styles.hostRow}>
        <Text style={styles.hostName}>{item.host_name}</Text>
        <Text style={styles.hostId}>ID: {item.host_id}</Text>
      </View>
      <View style={styles.incomeRow}>
        <Ionicons name="cash" size={20} color="#4CAF50" />
        <Text style={styles.incomeAmount}>{item.total_income.toLocaleString()}</Text>
        <Text style={styles.incomeCurrency}>Coins</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>Live Sessions: {item.live_count}</Text>
        <Text style={styles.detailText}>Avg: {Math.round(item.avg_income || 0)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9AEC9A" />

      <LinearGradient colors={["#9AEC9A", "#63EEA2"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pendapatan Host</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Period Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, period === "daily" && styles.activeTab]}
            onPress={() => setPeriod("daily")}
          >
            <Text style={[styles.tabText, period === "daily" && styles.activeTabText]}>Harian</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, period === "weekly" && styles.activeTab]}
            onPress={() => setPeriod("weekly")}
          >
            <Text style={[styles.tabText, period === "weekly" && styles.activeTabText]}>Mingguan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, period === "monthly" && styles.activeTab]}
            onPress={() => setPeriod("monthly")}
          >
            <Text style={[styles.tabText, period === "monthly" && styles.activeTabText]}>Bulanan</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#9AEC9A" />
        </View>
      ) : (
        <FlatList
          data={incomeData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderIncomeItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cash-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada data pendapatan</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 15,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4CAF50",
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  incomeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  hostName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  hostId: {
    fontSize: 12,
    color: "#666",
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginLeft: 8,
  },
  incomeCurrency: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
  },
});
