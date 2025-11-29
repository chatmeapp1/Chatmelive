import React, { useState, useEffect, useCallback } from "react";
import {
  Animated,
  RefreshControl,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ProfileHeader from "./components/ProfileHeader";
import ProfileBalance from "./components/ProfileBalance";
import ProfileFunctions from "./components/ProfileFunctions";
import api, { authAPI } from "../../utils/api";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followCounts, setFollowCounts] = useState({
    following: 0,
    followers: 0,
  });

  useEffect(() => {
    loadUserData();
    loadFollowCounts();
  }, []);

  // ✅ Reload data when screen is focused (e.g., after uploading avatar)
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 ProfileScreen focused - reloading data");
      loadUserData();
      loadFollowCounts();
    }, [])
  );

  const loadUserData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("📱 Token found:", token ? "Yes" : "No");

      if (!token) {
        console.error("❌ User token not found");
        setUserData(null);
        return;
      }

      // Fetch user data from the backend
      console.log("🔄 Fetching profile data...");
      const response = await authAPI.getProfile();
      console.log("✅ Profile response:", response);

      if (response && response.success && response.data) {
        const user = response.data;
        console.log("👤 User data:", user);

        setUserData({
          name: user.name || "Pengguna",
          id: `ID: ${user.id}`,
          phone: user.phone,
          avatar: user.avatar_url || require("../../../assets/images/avatar_default.png"),
          level: user.level || 1,
          vipLevel: user.vipLevel || 0,
        });
        setBalance(user.balance || 0);
      } else {
        console.error("❌ Invalid response structure");
        setUserData(null);
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error.message || error);

      if (error.response) {
        console.error("Response error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("Request error: No response received");
      }

      // Fallback to AsyncStorage
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const user = JSON.parse(storedData);
          console.log("💾 Using cached data:", user);

          setUserData({
            name: user.name || "Pengguna",
            id: `ID: ${user.id}`,
            phone: user.phone,
            avatar: require("../../../assets/images/avatar_default.png"),
            level: user.level || 1,
            vipLevel: user.vipLevel || 0,
          });
          setBalance(user.balance || 0);
        } else {
          console.log("❌ No cached data available");
          setUserData(null);
        }
      } catch (storageError) {
        console.error("❌ AsyncStorage fallback error:", storageError.message);
        setUserData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFollowCounts = async () => {
    try {
      const response = await api.get("/follows/counts");
      if (response.data.success) {
        setFollowCounts(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error loading follow counts:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData().then(() => setRefreshing(false));
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [200, 100],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Gagal memuat data profil</Text>
        <TouchableOpacity onPress={loadUserData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          { height: headerHeight }
        ]}
      >
        <ProfileHeader userData={userData} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 10,
        }}
      >
        <View style={styles.content}>
          {/* STATS */}
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate("FollowListScreen", { tab: "following" })}
            >
              <Text style={styles.statValue}>{followCounts.following}</Text>
              <Text style={styles.statLabel}>Ikuti</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate("FollowListScreen", { tab: "followers" })}
            >
              <Text style={styles.statValue}>{followCounts.followers}</Text>
              <Text style={styles.statLabel}>Penggemar</Text>
            </TouchableOpacity>
          </View>
          <ProfileBalance balance={balance} navigation={navigation} />
          <ProfileFunctions />

          {/* Pusat Belanja Button */}
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate("ProfileNavigator", { screen: "ShopScreen" })}
          >
            <Text style={styles.shopText}>Pusat Belanja</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              if (navigation) {
                navigation.navigate("ProfileNavigator", { screen: "SettingsScreen" });
              }
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.settingsText}>Pengaturan</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 9999,
    elevation: 10, // ✅ dukungan Android
  },
  scrollView: {
    flex: 1,
    marginTop: -20, // sambung halus antara header & konten
  },
  content: {
    marginHorizontal: 8,
    marginTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: -10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  statLabel: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },
  divider: {
    width: 1,
    backgroundColor: "#eee",
    height: "60%",
  },
  settingsButton: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
  shopButton: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shopText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});