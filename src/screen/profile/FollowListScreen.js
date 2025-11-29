import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../utils/api";
import LiveIcon from "../../components/LiveIcon";

export default function FollowListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const initialTab = route.params?.tab || "following";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "following") {
        const response = await api.get("/follows/following");
        if (response.data.success) {
          setFollowingList(response.data.data);
        }
      } else {
        const response = await api.get("/follows/followers");
        if (response.data.success) {
          setFollowersList(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await api.post("/follows/unfollow", {
        targetUserId: userId,
      });

      if (response.data.success) {
        setFollowingList((prev) => prev.filter((item) => item.id !== userId));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await api.post("/follows/follow", {
        targetUserId: userId,
      });

      if (response.data.success) {
        // Reload data to update button state
        loadData();
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const renderItem = ({ item }) => {
    const isFollowing = activeTab === "following";

    return (
      <View style={styles.userItem}>
        <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('ProfileScreen', { userId: item.id })}>
          <Image
            source={{
              uri: item.avatar_url
                ? `${api.defaults.baseURL.replace("/api", "")}${item.avatar_url}`
                : "https://picsum.photos/200",
            }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.name}</Text>
              {item.is_live && (
                <View style={styles.liveIconWrapper}>
                  <LiveIcon />
                </View>
              )}
            </View>
            <Text style={styles.fansCount}>{item.fans_count || 0} Fans</Text>
          </View>
        </TouchableOpacity>

        {isFollowing ? (
          <TouchableOpacity
            style={styles.followingBtn}
            onPress={() => handleUnfollow(item.id)}
          >
            <Text style={styles.followingText}>Following</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => handleFollow(item.id)}
          >
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const currentList = activeTab === "following" ? followingList : followersList;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === "following" ? "Ikuti" : "Penggemar"}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "following" && styles.activeTab]}
          onPress={() => setActiveTab("following")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "following" && styles.activeTabText,
            ]}
          >
            Ikuti
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "followers" && styles.activeTab]}
          onPress={() => setActiveTab("followers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followers" && styles.activeTabText,
            ]}
          >
            Penggemar
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D9A5" />
        </View>
      ) : (
        <FlatList
          data={currentList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === "following"
                  ? "Belum mengikuti siapapun"
                  : "Belum ada penggemar"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E8F9F4",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00D9A5",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#00D9A5",
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  liveIconWrapper: {
    marginLeft: 4,
  },
  fansCount: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  followingBtn: {
    backgroundColor: "#00D9A5",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  followBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00D9A5",
  },
  followText: {
    color: "#00D9A5",
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
    color: "#888",
  },
});