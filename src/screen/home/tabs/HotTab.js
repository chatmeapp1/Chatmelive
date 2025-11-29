
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import HostCard from "../components/HostCard";
import api from "../../../utils/api";

export default function HotTab() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotHosts();
    
    // Refresh setiap 30 detik untuk update host yang baru live
    const interval = setInterval(fetchHotHosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHotHosts = async () => {
    try {
      const response = await api.get("/hosts/hot");
      if (response.data.success) {
        setHosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hot hosts:", error);
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
});
