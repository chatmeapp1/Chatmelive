
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function CoinDetailScreen({ route, navigation }) {
  const { hostId } = route.params || {};
  const [filter, setFilter] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    fetchContributions();
  }, [filter]);

  const fetchContributions = async () => {
    if (!hostId || isNaN(hostId)) {
      console.log("❌ Invalid hostId:", hostId);
      setContributions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let period = "daily";
      if (filter === "weekly") period = "weekly";
      if (filter === "monthly") period = "monthly";

      console.log(`💰 Fetching contributions for host ${hostId}, period: ${period}`);
      const response = await api.get(`/contributions/${hostId}?period=${period}`);
      
      if (response.data.success) {
        console.log(`✅ Received ${response.data.data.length} contributions`);
        setContributions(response.data.data);
        setTotalCoins(response.data.totalCoins || 0);
      } else {
        console.log("⚠️ API returned no data");
        setContributions([]);
        setTotalCoins(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching contributions:", error.response?.data || error.message);
      setContributions([]);
      setTotalCoins(0);
      setLoading(false);
    }
  };

  const renderContributionItem = ({ item }) => (
    <View style={styles.contributionItem}>
      <View style={styles.contributionLeft}>
        <Ionicons name="gift" size={24} color="#4CAF50" />
        <View style={styles.contributionInfo}>
          <Text style={styles.contributionName}>{item.giftName}</Text>
          <Text style={styles.contributionTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.contributionRight}>
        <Text style={styles.contributionCoins}>+{item.coins}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FF6B9D", "#FFA07A"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar kontribusi</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, filter === "daily" && styles.tabActive]}
            onPress={() => setFilter("daily")}
          >
            <Text style={[styles.tabText, filter === "daily" && styles.tabTextActive]}>
              hari
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filter === "weekly" && styles.tabActive]}
            onPress={() => setFilter("weekly")}
          >
            <Text style={[styles.tabText, filter === "weekly" && styles.tabTextActive]}>
              minggu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filter === "monthly" && styles.tabActive]}
            onPress={() => setFilter("monthly")}
          >
            <Text style={[styles.tabText, filter === "monthly" && styles.tabTextActive]}>
              bulan
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : contributions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="gift-outline" size={80} color="#FFB6C1" />
            <Text style={styles.emptyText}>Orang ini belum menerima hadiah apa pun</Text>
          </View>
        ) : (
          <FlatList
            data={contributions}
            renderItem={renderContributionItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#FF6B9D",
  },
  content: {
    flex: 1,
    marginTop: -15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  contributionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contributionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contributionInfo: {
    marginLeft: 12,
  },
  contributionName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contributionTime: {
    fontSize: 12,
    color: "#999",
  },
  contributionRight: {
    alignItems: "flex-end",
  },
  contributionCoins: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
