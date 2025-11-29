
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyHostListScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/hosts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setHosts(response.data.data);
      }
    } catch (error) {
      console.error("Error loading hosts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHosts();
  };

  const renderHostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hostCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("HostDetailScreen", { hostId: item.id })}
    >
      <Image
        source={{ uri: item.avatar_url || `https://i.pravatar.cc/150?img=${item.id}` }}
        style={styles.avatar}
      />
      <View style={styles.hostInfo}>
        <Text style={styles.hostName}>{item.name}</Text>
        <Text style={styles.hostId}>ID: {item.id}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="radio" size={14} color="#666" />
            <Text style={styles.statText}>{item.total_lives || 0} Lives</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cash" size={14} color="#666" />
            <Text style={styles.statText}>{(item.total_income || 0).toLocaleString()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <View style={[styles.statusDot, { backgroundColor: item.is_active ? "#4CAF50" : "#999" }]} />
        <Text style={styles.statusText}>{item.is_active ? "Active" : "Inactive"}</Text>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>List Host</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={hosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHostItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada host yang bergabung</Text>
          </View>
        }
      />
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
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  hostCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
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
  hostId: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
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
