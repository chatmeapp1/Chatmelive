import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PenggemarScreen({ navigation }) {
  const [tab, setTab] = useState("Daily");
  const [hideRank, setHideRank] = useState(false);
  const [topContributors, setTopContributors] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadPenggemarData();
    }
  }, [tab, userId]);

  const getUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserId(userData.id);
        setUserAvatar(userData.avatar_url);
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error);
    }
  };

  const loadPenggemarData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const tabLower = tab.toLowerCase();
      const endpoint = tab === "Totally" ? "total" : tabLower;

      const [contributorsRes, rankRes] = await Promise.all([
        api.get(`/penggemar/${endpoint}`),
        api.get(`/penggemar/my-rank/${userId}`)
      ]);

      if (contributorsRes.data.success) {
        setTopContributors(contributorsRes.data.data || []);
      }
      if (rankRes.data.success) {
        setUserRank(rankRes.data.data[endpoint] || null);
      }
    } catch (error) {
      console.error("❌ Error loading penggemar data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#C2F7C6", "#9CEEC3", "#71E3C2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>tribusi Gempar Penggemar</Text>
          <TouchableOpacity>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["Daily", "Weekly", "Totally"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.tabButton,
                tab === label && styles.activeTabButton,
              ]}
              onPress={() => setTab(label)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === label && styles.activeTabText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48C47B" />
        </View>
      ) : topContributors.length === 0 ? (
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Belum ada data {tab.toLowerCase()} ranking penggemar
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={topContributors}
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => <ContributorItem item={item} index={index} />}
          scrollEnabled={false}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={userAvatar ? { uri: userAvatar } : require("../../../assets/images/avatar_default.png")}
          style={styles.avatar}
        />
        <View style={styles.footerText}>
          <Text style={styles.ratingTitle}>
            Rating display:{" "}
            <Text style={styles.notListed}>
              {userRank?.rank ? `Rank #${userRank.rank}` : "Not on the list"}
            </Text>
          </Text>
          <Text style={styles.contribute}>
            contribute: {userRank?.contribution || 0}
          </Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Hide ranking</Text>
          <Switch
            value={hideRank}
            onValueChange={(val) => setHideRank(val)}
            thumbColor={hideRank ? "#48C47B" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#A8E6C3" }}
          />
        </View>
      </View>
    </View>
  );
}

/* ================================ */
/* CONTRIBUTOR ITEM COMPONENT       */
/* ================================ */
const ContributorItem = ({ item, index }) => {
  const getMedalColor = () => {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return "#48C47B";
  };

  return (
    <View style={styles.contributorItem}>
      <View style={[styles.rankBadge, { backgroundColor: getMedalColor() }]}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>

      <Image
        source={item.avatar_url ? { uri: item.avatar_url } : require("../../../assets/images/avatar_default.png")}
        style={styles.contributorAvatar}
      />

      <View style={styles.contributorInfo}>
        <Text style={styles.contributorName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.contributorLevel}>Lv {item.level}</Text>
      </View>

      <View style={styles.contributorStats}>
        <Text style={styles.contribution}>{item.contribution}</Text>
        <Text style={styles.contributionLabel}>coins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // HEADER
  header: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 30,
    paddingTop: 60,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // TABS
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 25,
    marginHorizontal: 30,
    paddingVertical: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 25,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    shadowColor: "#999",
    shadowOpacity: 0.3,
    elevation: 2,
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#3CA86A",
  },

  // CONTENT
  scrollArea: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },

  // CONTRIBUTOR ITEM
  contributorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 2,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rankText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  contributorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  contributorLevel: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },
  contributorStats: {
    alignItems: "flex-end",
  },
  contribution: {
    color: "#48C47B",
    fontWeight: "700",
    fontSize: 14,
  },
  contributionLabel: {
    color: "#888",
    fontSize: 10,
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 0.6,
    borderColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  footerText: {
    flex: 1,
    marginLeft: 10,
  },
  ratingTitle: {
    color: "#333",
    fontSize: 13,
  },
  notListed: {
    color: "#666",
    fontWeight: "600",
  },
  contribute: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  switchLabel: {
    fontSize: 12,
    color: "#555",
  },
});