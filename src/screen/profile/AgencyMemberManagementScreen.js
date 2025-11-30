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
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const { width } = Dimensions.get("window");

export default function AgencyMemberManagementScreen({ navigation, route }) {
  const { agencyId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMembers(response.data.data);
        setFilteredMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      Alert.alert("Error", "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        member.name.toLowerCase().includes(text.toLowerCase()) ||
        member.user_id.toString().includes(text) ||
        member.id_number?.includes(text)
      );
      setFilteredMembers(filtered);
    }
  };

  const canDeleteToday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const gmt7Hours = now.getUTCHours() + 7;
    // Tuesday = 2 in JavaScript (0=Sunday, 1=Monday, 2=Tuesday...)
    return dayOfWeek === 2;
  };

  const handleDeleteMember = (memberId, memberName) => {
    if (!canDeleteToday()) {
      Alert.alert(
        "Pembatasan",
        "Host hanya dapat dihapus pada hari Selasa (GMT+7). Silakan coba lagi pada hari Selasa."
      );
      return;
    }

    Alert.alert(
      "Konfirmasi Penghapusan",
      `Anda yakin ingin menghapus ${memberName}? Semua catatan siaran langsung akan hilang.\n\nTindakan ini tidak dapat dibatalkan!`,
      [
        { text: "Batal", onPress: () => {}, style: "cancel" },
        {
          text: "Hapus",
          onPress: async () => {
            await performDelete(memberId);
          },
          style: "destructive",
        },
      ]
    );
  };

  const performDelete = async (memberId) => {
    try {
      setDeleting(memberId);
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.delete(
        `/agency/${agencyId}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert("Sukses", "Member berhasil dihapus");
        setMembers(members.filter((m) => m.id !== memberId));
        setFilteredMembers(filteredMembers.filter((m) => m.id !== memberId));
      } else {
        Alert.alert("Error", response.data.message || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to delete member");
    } finally {
      setDeleting(null);
    }
  };

  const getMemberInfo = (member) => {
    const thisMonth = new Date();
    const joinDate = member.approved_at
      ? new Date(member.approved_at).toLocaleDateString("id-ID")
      : "Invalid date";

    return {
      income: member.monthly_income || "0.00",
      joinDate,
    };
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
        <Text style={styles.headerTitle}>Manajemen Member</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Member Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countLabel}>Anggota: {members.length}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#ccc" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan ID atau Nama pengguna"
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>

        {/* Warning Messages */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>⚠️ Penting:</Text>
          <Text style={styles.warningText}>
            1. Host hanya dapat dihapus pada hari Selasa (GMT+7)
          </Text>
          <Text style={styles.warningText}>
            2. Jika Admin menghapus host, semua catatan siaran langsung (durasi dan aliran berlarian) dari host akan hilang, harap beroperasi dengan hati-hati
          </Text>
        </View>

        {/* Members List */}
        <View style={styles.membersContainer}>
          {filteredMembers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada member ditemukan</Text>
            </View>
          ) : (
            filteredMembers.map((member) => {
              const info = getMemberInfo(member);
              return (
                <View key={member.id} style={styles.memberCard}>
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
                      <Text style={styles.memberId}>Id:{member.user_id}</Text>
                    </View>
                  </View>

                  {/* Right Side */}
                  <View style={styles.memberRight}>
                    <View style={styles.incomeContainer}>
                      <Text style={styles.incomeLabel}>
                        Penghasilan bulan ini:
                      </Text>
                      <Text style={styles.incomeValue}> {info.income}</Text>
                    </View>
                    <View style={styles.joinDateContainer}>
                      <Text style={styles.joinDateLabel}>
                        Tanggal Bergabung:
                      </Text>
                      <Text style={styles.joinDateValue}> {info.joinDate}</Text>
                    </View>

                    {/* Delete Button */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleDeleteMember(member.id, member.name)
                      }
                      disabled={deleting === member.id}
                    >
                      {deleting === member.id ? (
                        <ActivityIndicator size="small" color="#FF4444" />
                      ) : (
                        <Ionicons
                          name="trash"
                          size={18}
                          color="#FF4444"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  countContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  countLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: "#333",
  },
  warningContainer: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D32F2F",
    marginBottom: 6,
  },
  warningText: {
    fontSize: 11,
    color: "#D32F2F",
    lineHeight: 16,
    marginBottom: 4,
  },
  membersContainer: {
    paddingBottom: 20,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderRadius: 10,
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
  memberRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  incomeContainer: {
    marginBottom: 4,
  },
  incomeLabel: {
    fontSize: 10,
    color: "#999",
  },
  incomeValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#007AFF",
  },
  joinDateContainer: {
    marginBottom: 8,
  },
  joinDateLabel: {
    fontSize: 10,
    color: "#999",
  },
  joinDateValue: {
    fontSize: 11,
    color: "#999",
  },
  deleteButton: {
    padding: 6,
    marginTop: 4,
  },
});
