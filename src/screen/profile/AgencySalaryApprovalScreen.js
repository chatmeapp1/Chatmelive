
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencySalaryApprovalScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSalaryRequests();
  }, []);

  const loadSalaryRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/salary-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error loading salary requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (requestId) => {
    Alert.alert(
      "Konfirmasi",
      "Setujui permintaan gaji pokok untuk host ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Setuju",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              await api.post(
                `/agency/${agencyId}/salary-approve`,
                { requestId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert("Sukses", "Permintaan disetujui");
              loadSalaryRequests();
            } catch (error) {
              Alert.alert("Error", "Gagal menyetujui permintaan");
            }
          },
        },
      ]
    );
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      "Konfirmasi",
      "Tolak permintaan gaji pokok untuk host ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Tolak",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              await api.post(
                `/agency/${agencyId}/salary-reject`,
                { requestId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert("Sukses", "Permintaan ditolak");
              loadSalaryRequests();
            } catch (error) {
              Alert.alert("Error", "Gagal menolak permintaan");
            }
          },
        },
      ]
    );
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View>
          <Text style={styles.hostName}>{item.host_name}</Text>
          <Text style={styles.hostId}>ID: {item.host_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>Minggu: {item.week_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#666" />
          <Text style={styles.detailText}>Gaji: {item.salary_amount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="radio" size={16} color="#666" />
          <Text style={styles.detailText}>Total Live: {item.total_lives}</Text>
        </View>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(item.id)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Tolak</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Setuju</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA726";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#999";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      default:
        return status;
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
          <Text style={styles.headerTitle}>Gaji Pokok Host</Text>
          <TouchableOpacity onPress={() => setRefreshing(true) || loadSalaryRequests()}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadSalaryRequests();
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada permintaan gaji</Text>
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
  requestCard: {
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
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  requestDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
