
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function ExchangeHistoryScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/income/exchange-history");
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching exchange history:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Ionicons name="swap-horizontal" size={24} color="#4DD179" />
        <Text style={styles.historyDate}>
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={styles.historyDivider} />
      <View style={styles.historyRow}>
        <Text style={styles.historyLabel}>Diamond</Text>
        <Text style={styles.historyDiamond}>
          -{item.diamonds.toLocaleString()}
        </Text>
      </View>
      <View style={styles.historyRow}>
        <Text style={styles.historyLabel}>Coin Diterima</Text>
        <Text style={styles.historyCoin}>
          +{item.coins.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerText}>Riwayat Exchange</Text>
          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4DD179" />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada riwayat exchange</Text>
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  historyDate: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  historyDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  historyLabel: {
    fontSize: 14,
    color: "#666",
  },
  historyDiamond: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  historyCoin: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4DD179",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
});
