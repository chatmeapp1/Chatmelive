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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

export default function AgencyApproveHostScreen({ navigation, route }) {
  const { agencyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [agencyId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const response = await api.get(`/agency/${agencyId}/host-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setApplications(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      Alert.alert("Error", "Failed to load host applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApproveHost = async (appId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await api.post(
        `/agency/host-application/${appId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert("Success", "Host approved successfully!");
        await fetchApplications();
      }
    } catch (error) {
      console.error("Error approving host:", error);
      Alert.alert("Error", "Failed to approve host");
    }
  };

  const handleRejectHost = async (appId) => {
    Alert.alert(
      "Reject Host",
      "Are you sure you want to reject this host?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const response = await api.post(
                `/agency/host-application/${appId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.data.success) {
                Alert.alert("Success", "Host rejected successfully!");
                await fetchApplications();
              }
            } catch (error) {
              console.error("Error rejecting host:", error);
              Alert.alert("Error", "Failed to reject host");
            }
          },
        },
      ]
    );
  };

  const renderApplicationItem = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View>
          <Text style={styles.applicationName}>{item.name}</Text>
          <Text style={styles.applicationId}>ID: {item.host_id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === "pending"
              ? styles.statusPending
              : item.status === "approved"
              ? styles.statusApproved
              : styles.statusRejected,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.detailText}>Gender: {item.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="card" size={16} color="#666" />
          <Text style={styles.detailText}>ID Card: {item.id_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            Applied: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveHost(item.id)}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleRejectHost(item.id)}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#9AEC9A" />
      </View>
    );
  }

  const pendingApps = applications.filter((app) => app.status === "pending");
  const approvedApps = applications.filter((app) => app.status === "approved");
  const rejectedApps = applications.filter((app) => app.status === "rejected");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9AEC9A" />

      <LinearGradient
        colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Approve Host</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={{
          progressViewOffset: 0,
          onRefresh: () => {
            setRefreshing(true);
            fetchApplications();
          },
        }}
      >
        {/* Pending Section */}
        {pendingApps.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending ({pendingApps.length})</Text>
            </View>
            {pendingApps.map((item) => (
              <View key={item.id}>
                {renderApplicationItem({ item })}
              </View>
            ))}
          </View>
        )}

        {/* Approved Section */}
        {approvedApps.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Approved ({approvedApps.length})</Text>
            </View>
            {approvedApps.map((item) => (
              <View key={item.id}>
                {renderApplicationItem({ item })}
              </View>
            ))}
          </View>
        )}

        {/* Rejected Section */}
        {rejectedApps.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rejected ({rejectedApps.length})</Text>
            </View>
            {rejectedApps.map((item) => (
              <View key={item.id}>
                {renderApplicationItem({ item })}
              </View>
            ))}
          </View>
        )}

        {applications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="inbox-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No host applications yet</Text>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 15,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  applicationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  applicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  applicationId: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPending: {
    backgroundColor: "#FFF3CD",
  },
  statusApproved: {
    backgroundColor: "#D4EDDA",
  },
  statusRejected: {
    backgroundColor: "#F8D7DA",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  applicationDetails: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#6EE096",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 10,
  },
});
