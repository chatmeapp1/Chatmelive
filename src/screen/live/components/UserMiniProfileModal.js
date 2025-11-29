import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { authAPI } from "../../../utils/api";
import api from "../../../utils/api";
import getEnvVars from "../../../utils/env";

const { API_URL } = getEnvVars();

export default function UserMiniProfileModal({ visible, userId, onClose }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      loadUserProfile();
    }
  }, [visible, userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${userId}/mini-profile`);
      if (response.data.success) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSource = () => {
    if (!userProfile?.avatar_url) {
      return require("../../../../assets/images/avatar_default.png");
    }
    if (userProfile.avatar_url.startsWith("/")) {
      return { uri: `${API_URL}${userProfile.avatar_url}` };
    }
    if (userProfile.avatar_url.startsWith("http")) {
      return { uri: userProfile.avatar_url };
    }
    return require("../../../../assets/images/avatar_default.png");
  };

  const getLevelColor = (level) => {
    if (level <= 10) return "#FF8BC9";
    if (level <= 20) return "#7ED7FF";
    if (level <= 30) return "#FFE27A";
    if (level <= 50) return "#FF9B30";
    if (level <= 70) return "#B657FF";
    return "#FF2D55";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={60} style={styles.blurContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : userProfile ? (
              <ScrollView
                scrollEnabled={true}
                contentContainerStyle={styles.scrollContent}
              >
                {/* CLOSE BUTTON */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                {/* AVATAR */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={getAvatarSource()}
                    style={styles.avatar}
                  />
                </View>

                {/* USER INFO */}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userId}>ID:{userProfile.id}</Text>
                </View>

                {/* BIO */}
                {userProfile.signature && (
                  <Text style={styles.bio}>{userProfile.signature}</Text>
                )}

                {/* LEVEL BADGES */}
                <View style={styles.badgeContainer}>
                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(userProfile.level) },
                    ]}
                  >
                    <Ionicons name="star" size={16} color="#fff" />
                    <Text style={styles.badgeText}>User Level</Text>
                    <Text style={styles.badgeNumber}>{userProfile.level}</Text>
                  </View>

                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: "#FFD700" },
                    ]}
                  >
                    <Ionicons name="crown" size={16} color="#fff" />
                    <Text style={styles.badgeText}>Host Level</Text>
                    <Text style={styles.badgeNumber}>{userProfile.vipLevel}</Text>
                  </View>
                </View>

                {/* FOLLOW/FANS */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {userProfile.following}
                    </Text>
                    <Text style={styles.statLabel}>Ikuti</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {userProfile.followers}
                    </Text>
                    <Text style={styles.statLabel}>Penggemar</Text>
                  </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionButtonsTop}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.reportBtn]}
                    onPress={() => Alert.alert("Report", "Laporkan user ini")}
                  >
                    <Text style={styles.actionBtnText}>Report</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.blockBtn]}
                    onPress={() => Alert.alert("Block", "Blokir user ini")}
                  >
                    <Text style={styles.actionBtnText}>Block</Text>
                  </TouchableOpacity>
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.actionButtonsBottom}>
                  <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={onClose}
                  >
                    <Text style={styles.bottomBtnText}>OK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => Alert.alert("Send Gift", "Kirim hadiah")}
                  >
                    <Text style={styles.bottomBtnText}>Send Gift</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => Alert.alert("Chat", "Obrolan pribadi")}
                  >
                    <Text style={styles.bottomBtnText}>Obrolan pribadi</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => Alert.alert("Tag", "@TA")}
                  >
                    <Text style={styles.bottomBtnText}>@TA</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => Alert.alert("More", "Lebih banyak opsi")}
                  >
                    <Text style={styles.bottomBtnText}>More</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#aaa",
  },
  bio: {
    fontSize: 13,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  badgeNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  actionButtonsTop: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reportBtn: {
    backgroundColor: "#2ECC71",
  },
  blockBtn: {
    backgroundColor: "#E74C3C",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtonsBottom: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bottomBtn: {
    backgroundColor: "rgba(100, 200, 200, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 200, 200, 0.6)",
  },
  bottomBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00CED1",
  },
});
