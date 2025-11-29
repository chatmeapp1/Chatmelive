import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function FansRankingScreen({ route, navigation }) {
  const { hostId } = route.params || {};
  const [filter, setFilter] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [rankData, setRankData] = useState([]);

  useEffect(() => {
    fetchRankingData();
  }, [filter]);

  const fetchRankingData = async () => {
    if (!hostId || isNaN(hostId)) {
      console.log("❌ Invalid hostId:", hostId);
      setRankData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let period = "daily";
      if (filter === "hourly") period = "hourly";
      if (filter === "weekly") period = "weekly";
      if (filter === "totally") period = "all";

      console.log(`📊 Fetching ranking for host ${hostId}, period: ${period}`);
      const response = await api.get(`/ranking/fans/${hostId}?period=${period}`);
      
      if (response.data.success) {
        console.log(`✅ Received ${response.data.data.length} ranking entries`);
        setRankData(response.data.data);
      } else {
        console.log("⚠️ API returned no data");
        setRankData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching ranking:", error.response?.data || error.message);
      setRankData([]);
      setLoading(false);
    }
  };

  const renderRankItem = ({ item, index }) => {
    const getRankColor = (rank) => {
      if (rank === 0) return ["#FFD700", "#FFA500"];
      if (rank === 1) return ["#C0C0C0", "#808080"];
      if (rank === 2) return ["#CD7F32", "#8B4513"];
      return ["#4A4A4A", "#2C2C2C"];
    };

    return (
      <View style={styles.rankItem}>
        <LinearGradient
          colors={getRankColor(index)}
          style={styles.rankBadge}
        >
          <Text style={styles.rankNumber}>{index + 1}</Text>
        </LinearGradient>

        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.levelBox}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.levelText}>Lv.{item.level}</Text>
          </View>
        </View>

        <View style={styles.coinsBox}>
          <Ionicons name="diamond" size={16} color="#FFD700" />
          <Text style={styles.coinsText}>{item.coins.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Fans Ranking</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "hourly" && styles.filterActive]}
            onPress={() => setFilter("hourly")}
          >
            <Text style={[styles.filterText, filter === "hourly" && styles.filterTextActive]}>
              Hourly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "daily" && styles.filterActive]}
            onPress={() => setFilter("daily")}
          >
            <Text style={[styles.filterText, filter === "daily" && styles.filterTextActive]}>
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "weekly" && styles.filterActive]}
            onPress={() => setFilter("weekly")}
          >
            <Text style={[styles.filterText, filter === "weekly" && styles.filterTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "totally" && styles.filterActive]}
            onPress={() => setFilter("totally")}
          >
            <Text style={[styles.filterText, filter === "totally" && styles.filterTextActive]}>
              All Time
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <FlatList
            data={rankData}
            renderItem={renderRankItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    minWidth: 70,
  },
  filterActive: {
    backgroundColor: "#FFD700",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#1a1a2e",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  levelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  levelText: {
    color: "#aaa",
    fontSize: 12,
  },
  coinsBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coinsText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
});
