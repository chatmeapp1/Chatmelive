
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import HostCard from "../components/HostCard";
import api from "../../../utils/api";

export default function FollowTab() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowedHosts();
  }, []);

  const fetchFollowedHosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hosts/followed");
      if (response.data.success) {
        setHosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching followed hosts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D9A5" />
      </View>
    );
  }

  if (hosts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada host yang diikuti</Text>
        <Text style={styles.emptySubtext}>Follow host favorit kamu untuk melihat live mereka di sini</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HostCard host={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  list: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
