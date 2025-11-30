
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [agencyData, setAgencyData] = useState(null);
  const [stats, setStats] = useState({
    totalHosts: 0,
    activeHosts: 0,
    totalIncome: 0,
    todayIncome: 0,
  });

  useEffect(() => {
    checkAgencyAccess();
  }, []);

  const checkAgencyAccess = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Please login first");
        navigation.goBack();
        return;
      }

      // Check if user has agency role
      const response = await api.get("/agency/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAgencyData(response.data.data);
        loadStats(response.data.data.id);
      } else {
        Alert.alert("Access Denied", "You don't have agency access", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error checking agency access:", error);
      Alert.alert("Error", "Failed to verify agency access", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (agencyId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const menuItems = [
    {
      id: "approve",
      title: "Approve Host",
      description: "Review & approve host applications",
      icon: "checkmark-circle",
      screen: "AgencyApproveHost",
      color: ["#9AEC9A", "#63EEA2"],
    },
    {
      id: "addhost",
      title: "Add Host",
      description: "Invite new host ke agency",
      icon: "person-add",
      screen: "AgencyAddHost",
      color: ["#667eea", "#764ba2"],
    },
    {
      id: "hosts",
      title: "List Host",
      description: "Lihat semua host yang bergabung",
      icon: "people",
      screen: "AgencyHostList",
      color: ["#f093fb", "#f5576c"],
    },
    {
      id: "income",
      title: "Pendapatan Host",
      description: "Harian, Mingguan, Bulanan",
      icon: "cash",
      screen: "AgencyHostIncome",
      color: ["#4facfe", "#00f2fe"],
    },
    {
      id: "live",
      title: "Total Live",
      description: "Statistik live harian & mingguan",
      icon: "radio",
      screen: "AgencyLiveStats",
      color: ["#43e97b", "#38f9d7"],
    },
    {
      id: "salary",
      title: "Gaji Pokok Host",
      description: "Approval gaji mingguan",
      icon: "wallet",
      screen: "AgencySalaryApproval",
      color: ["#fa709a", "#fee140"],
    },
    {
      id: "total",
      title: "Total Income",
      description: "Pendapatan semua host",
      icon: "stats-chart",
      screen: "AgencyTotalIncome",
      color: ["#FF6B6B", "#FFB3B3"],
    },
  ];

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

      {/* Header */}
      <LinearGradient colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agency Dashboard</Text>
          <View style={{ width: 24 }} />
        </View>

        {agencyData && (
          <View style={styles.agencyInfo}>
            <Text style={styles.agencyName}>{agencyData.family_name}</Text>
            <Text style={styles.agencyId}>ID: {agencyData.id}</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.statGradient}>
              <Ionicons name="people" size={32} color="#fff" />
              <Text style={styles.statValue}>{stats.totalHosts}</Text>
              <Text style={styles.statLabel}>Total Host</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.statGradient}>
              <Ionicons name="cash" size={32} color="#fff" />
              <Text style={styles.statValue}>{stats.todayIncome.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Income Hari Ini</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.screen, { agencyId: agencyData?.id })}
            >
              <LinearGradient colors={item.color} style={styles.menuGradient}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={36} color="#fff" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingBottom: 30,
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
  agencyInfo: {
    alignItems: "center",
  },
  agencyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  agencyId: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 13,
    color: "#fff",
    marginTop: 5,
    opacity: 0.9,
  },
  menuGrid: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  menuCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  menuDescription: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    position: "absolute",
    bottom: 20,
    left: 95,
  },
});
