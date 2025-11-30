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
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";
import AgencyLogoUploadModal from "../../components/AgencyLogoUploadModal";

const { width } = Dimensions.get("window");

export default function AgencyDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [agencyData, setAgencyData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [stats, setStats] = useState({
    totalHosts: 0,
    thisWeekIncome: 0,
    lastMonthIncome: 0,
    totalMembers: 138,
    thisMonthIncome: 0,
  });

  useEffect(() => {
    checkAgencyAccess();
  }, []);

  const checkAgencyAccess = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Please login first");
        navigation.goBack();
        return;
      }

      const response = await api.get("/agency/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAgencyData(response.data.data);
        setAgencyLogo(response.data.data?.logo_url);
        loadStats(response.data.data.id);
      } else {
        Alert.alert("Access Denied", "You don't have agency access", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error checking agency access:", error);
      Alert.alert("Error", "Failed to verify agency access", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (agencyId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/agency/${agencyId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats({
          ...stats,
          ...response.data.data,
          totalMembers: response.data.data.totalHosts || 138,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Penghasilan member",
      icon: "wallet",
      screen: "AgencyHostIncome",
      color: "#FFA500",
    },
    {
      id: 2,
      title: "Undangan member",
      icon: "user-plus",
      screen: "AgencyAddHost",
      color: "#FFA500",
    },
    {
      id: 3,
      title: "Manajemen Member",
      icon: "users",
      screen: "AgencyMemberManagement",
      color: "#FFA500",
    },
    {
      id: 4,
      title: "Member active days",
      icon: "calendar",
      screen: "AgencyActiveDays",
      color: "#FFA500",
    },
    {
      id: 5,
      title: "Sertifikasi informasi pemimpin serikat",
      icon: "file-text",
      screen: "AgencyCertification",
      color: "#FFA500",
    },
    {
      id: 6,
      title: "Informasi rekening bank",
      status: "sedang diverifikasi",
      icon: "credit-card",
      color: "#FFA500",
      disabled: true,
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  // Extract agency initials for logo
  const initials = agencyData?.family_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "MM";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agency</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Agency Card */}
        <View style={styles.agencyCardContainer}>
          <LinearGradient
            colors={["#FF1744", "#FF6E40", "#B71C1C", "#9C27B0", "#6A1B9A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.agencyCard}
          >
            {/* Left side content */}
            <View style={styles.cardLeftContent}>
              <Text style={styles.agencyName}>{agencyData?.family_name || "Agency Name"}</Text>
              <Text style={styles.agencyId}>ID:{agencyData?.id || "2010"}</Text>

              <Text style={styles.incomeLabel}>Total berlian bulan ini:</Text>
              <Text style={styles.incomeValue}>{stats.thisMonthIncome || 0}</Text>
            </View>

            {/* Right side logo circle with crown */}
            <TouchableOpacity
              style={styles.cardLogo}
              onPress={() => setShowUploadModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.logoBg}>
                {agencyLogo ? (
                  <>
                    <Image
                      source={{ uri: agencyLogo }}
                      style={styles.logoImage}
                    />
                    <View style={styles.uploadOverlay}>
                      <FontAwesome name="camera" size={16} color="#fff" />
                    </View>
                  </>
                ) : (
                  <>
                    {/* Crown */}
                    <FontAwesome
                      name="star"
                      size={20}
                      color="#FFD700"
                      style={styles.crown}
                    />
                    {/* Initials */}
                    <Text style={styles.initials}>{initials}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.thisWeekIncome || 0}</Text>
            <Text style={styles.statLabel}>Total berlian{"\n"}minggu ini</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.lastMonthIncome || 0}</Text>
            <Text style={styles.statLabel}>Total berlian bulan{"\n"}lalu</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalMembers || 138}</Text>
            <Text style={styles.statLabel}>Member</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuBorder]}
              disabled={item.disabled}
              onPress={() => {
                if (!item.disabled && item.screen) {
                  navigation.navigate(item.screen, { agencyId: agencyData?.id });
                }
              }}
              activeOpacity={item.disabled ? 1 : 0.7}
            >
              <View style={styles.menuItemLeft}>
                <FontAwesome name={item.icon} size={24} color={item.color} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.status && <Text style={styles.menuStatus}>{item.status}</Text>}
                </View>
              </View>
              {!item.disabled && (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Warning Text */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            *Penggat: Anda hanya dapat menghubungi staf resmi untuk bantuan. Kami tidak akan meminta atau memberikan informasi pribadi melalui saluran lain.
          </Text>
        </View>
      </ScrollView>

      {/* Upload Modal */}
      <AgencyLogoUploadModal
        isVisible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        agencyId={agencyData?.id}
        onUploadSuccess={(logoUrl) => {
          setAgencyLogo(logoUrl);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  agencyCardContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  agencyCard: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 180,
  },
  cardLeftContent: {
    flex: 1,
  },
  agencyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  agencyId: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
  },
  incomeLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  incomeValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  cardLogo: {
    marginLeft: 20,
  },
  logoBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    position: "relative",
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  uploadOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
  },
  crown: {
    position: "absolute",
    top: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },
  menuStatus: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  warningContainer: {
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  warningText: {
    fontSize: 12,
    color: "#FF1744",
    fontStyle: "italic",
  },
});
