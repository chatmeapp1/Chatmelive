import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const { width } = Dimensions.get("window");

export default function AgencyActiveDaysScreen({ navigation, route }) {
  const { agencyId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState("month");

  useEffect(() => {
    fetchActiveDays();
  }, [filterPeriod]);

  const fetchActiveDays = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(
        `/agency/${agencyId}/active-days?period=${filterPeriod}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching active days:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jumlah hari anggota aktif</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterPeriod === "week" && styles.activeFilterTab]}
          onPress={() => setFilterPeriod("week")}
        >
          <Text
            style={[
              styles.filterTabText,
              filterPeriod === "week" && styles.activeFilterTabText,
            ]}
          >
            Minggu ini
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterPeriod === "month" && styles.activeFilterTab]}
          onPress={() => setFilterPeriod("month")}
        >
          <Text
            style={[
              styles.filterTabText,
              filterPeriod === "month" && styles.activeFilterTabText,
            ]}
          >
            Bulan ini
          </Text>
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.memberLabel}>
          <Text style={styles.memberLabelText}>Anggota</Text>
        </View>

        {members.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data aktivitas</Text>
          </View>
        ) : (
          members.map((member, index) => (
            <View
              key={member.id}
              style={[
                styles.memberCard,
                index !== members.length - 1 && styles.memberCardBorder,
              ]}
            >
              <View style={styles.memberLeft}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  {member.avatar_url ? (
                    <Image
                      source={{ uri: member.avatar_url }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <FontAwesome name="user" size={24} color="#fff" />
                    </View>
                  )}
                  {member.badge && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{member.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Member Info */}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberId}>ID:{member.user_id}</Text>
                </View>
              </View>

              {/* Active Days */}
              <View style={styles.daysContainer}>
                <Text style={styles.daysText}>{member.active_days} days</Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterTab: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  activeFilterTab: {
    backgroundColor: "#FFA500",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  activeFilterTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memberLabel: {
    paddingVertical: 12,
  },
  memberLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  memberCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  badgeContainer: {
    position: "absolute",
    bottom: -2,
    right: -4,
    backgroundColor: "#FFD700",
    borderRadius: 9,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#fff",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#333",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  memberId: {
    fontSize: 11,
    color: "#999",
  },
  daysContainer: {
    marginLeft: 12,
  },
  daysText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
