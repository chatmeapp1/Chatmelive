import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function TopGiversScreen({ navigation }) {
  const [topGivers, setTopGivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTopGivers();
  }, []);

  const loadTopGivers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/gifts/top-givers");
      if (response.data.success && response.data.data) {
        setTopGivers(response.data.data.slice(0, 5));
        setError(null);
      }
    } catch (err) {
      console.error("❌ Error loading top givers:", err);
      setError("Gagal memuat data top pemberi hadiah");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    const badges = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
    return badges[index] || "•";
  };

  const getMedalColor = (index) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "#C0C0C0";
    if (index === 2) return "#CD7F32";
    return "#888";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Pemberi Hadiah</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00C67A" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadTopGivers}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : topGivers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="gift-outline" size={60} color="#ddd" />
          <Text style={styles.emptyText}>Belum ada data</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {topGivers.map((giver, index) => (
            <View key={giver.user_id} style={styles.rankItem}>
              <View style={styles.rankBadgeContainer}>
                <Text style={[styles.rankBadge, { color: getMedalColor(index) }]}>
                  {getRankBadge(index)}
                </Text>
              </View>

              <Image
                source={{
                  uri: giver.avatar_url || "https://via.placeholder.com/50",
                }}
                style={styles.avatar}
              />

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{giver.name}</Text>
                <Text style={styles.userLevel}>Level {giver.level}</Text>
              </View>

              <View style={styles.giftCount}>
                <Ionicons name="gift" size={18} color="#FF6B9D" />
                <Text style={styles.giftText}>{giver.total_gifts}</Text>
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Pemberi hadiah terbanyak minggu ini
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rankBadgeContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rankBadge: {
    fontSize: 28,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 12,
    color: "#999",
  },
  giftCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  giftText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B9D",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#00C67A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
