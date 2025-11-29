
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

export default function AgencyLiveStatsScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("daily");
  const [stats, setStats] = useState({
    totalLives: 0,
    activeLives: 0,
    totalViewers: 0,
    avgDuration: 0,
    topHosts: [],
  });

  useEffect(() => {
    loadLiveStats();
  }, [period]);

  const loadLiveStats = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/live-stats/${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error loading live stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9AEC9A" />

      <LinearGradient colors={["#9AEC9A", "#63EEA2"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistik Live</Text>
          <View style={{ width: 24 }} />
        </View>

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
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#9AEC9A" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.statGradient}>
                <Ionicons name="radio" size={28} color="#fff" />
                <Text style={styles.statValue}>{stats.totalLives}</Text>
                <Text style={styles.statLabel}>Total Live</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.statGradient}>
                <Ionicons name="pulse" size={28} color="#fff" />
                <Text style={styles.statValue}>{stats.activeLives}</Text>
                <Text style={styles.statLabel}>Live Aktif</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.statGradient}>
                <Ionicons name="eye" size={28} color="#fff" />
                <Text style={styles.statValue}>{stats.totalViewers}</Text>
                <Text style={styles.statLabel}>Total Viewers</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.statGradient}>
                <Ionicons name="time" size={28} color="#fff" />
                <Text style={styles.statValue}>{Math.round(stats.avgDuration)}</Text>
                <Text style={styles.statLabel}>Avg Menit</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Top Hosts */}
          <View style={styles.topHostsSection}>
            <Text style={styles.sectionTitle}>Top Host Live</Text>
            {stats.topHosts?.map((host, index) => (
              <View key={index} style={styles.topHostCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{host.name}</Text>
                  <Text style={styles.hostStats}>
                    {host.live_count} Lives • {host.total_viewers} Viewers
                  </Text>
                </View>
                <Text style={styles.hostDuration}>{Math.round(host.total_duration)} min</Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    gap: 15,
  },
  statCard: {
    width: "47%",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    opacity: 0.9,
  },
  topHostsSection: {
    padding: 15,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  topHostCard: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9AEC9A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  hostStats: {
    fontSize: 12,
    color: "#666",
  },
  hostDuration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
});
