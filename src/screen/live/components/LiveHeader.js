import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import UserMiniProfileModal from "./UserMiniProfileModal";

const { width } = Dimensions.get("window");

export default function LiveHeader({
  host,
  viewers,
  totalViewers,
  onPressViewers,
  onClose,
}) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // hanya tampilkan 4 viewer terakhir
  const lastViewers = viewers.slice(-4);

  const handleAvatarPress = (userId) => {
    setSelectedUserId(userId);
    setProfileModalVisible(true);
  };

  return (
    <>
      <BlurView intensity={38} tint="dark" style={styles.headerBlur}>
        <View style={styles.row}>

          {/* ✅ HOST AVATAR + ID */}
          <TouchableOpacity
            style={styles.hostRow}
            onPress={() => handleAvatarPress(host.id)}
          >
            <View style={styles.avatarWrap}>
              <Image source={{ uri: host.image }} style={styles.avatar} />

              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.hostName}>{host.name}</Text>
              <Text style={styles.hostId}>{host.id}</Text>
            </View>
          </TouchableOpacity>

        {/* ✅ RIGHT SIDE GROUP */}
        <View style={styles.rightGroup} pointerEvents="box-none">

          {/* ✅ VIEWER LIST (4 TERAKHIR) */}
          <View style={styles.viewerStrip} pointerEvents="box-none">
            {lastViewers.map((v, i) => (
              <TouchableOpacity
                key={v.userId || v.id}
                onPress={() => handleAvatarPress(v.userId || v.id)}
              >
                <Image
                  source={{ uri: v.avatar || v.avatar_url }}
                  style={[
                    styles.viewerAvatar,
                    i !== 0 && { marginLeft: -8 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ TOTAL VIEWER BUBBLE */}
          <View style={styles.viewerCount} pointerEvents="none">
            <Text style={styles.viewerCountText}>{totalViewers}</Text>
          </View>

          {/* ✅ CLOSE BUTTON */}
          {onClose && (
            <View pointerEvents="auto">
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.6}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      </BlurView>

      {/* ✅ USER MINI PROFILE MODAL */}
      <UserMiniProfileModal
        visible={profileModalVisible}
        userId={selectedUserId}
        onClose={() => setProfileModalVisible(false)}
      />
    </>
  );
}

// ============================= STYLE =============================
const styles = StyleSheet.create({
  headerBlur: {
    position: "absolute",
    top: 40,
    left: 10,
    width: width - 20,
    borderRadius: 16,
    padding: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    pointerEvents: "box-none",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // HOST AREA
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.6)",
  },

  liveBadge: {
    position: "absolute",
    bottom: -2,
    left: 0,
    backgroundColor: "rgba(255, 45, 85, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 100, 130, 0.5)",
  },

  liveText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },

  hostName: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },

  hostId: {
    color: "#eaeaea",
    fontSize: 14,
    fontWeight: "500",
  },

  // RIGHT GROUP
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ✅ BUBBLE COIN PENDAPATAN
  coinBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    marginRight: 10,
  },

  coinIcon: {
    width: 19,
    height: 19,
    resizeMode: "contain",
    marginRight: 4,
  },

  coinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // ✅ VIEWER AVATARS
  viewerStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    pointerEvents: "auto",
  },

  viewerAvatar: {
    width: 33,
    height: 33,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // ✅ TOTAL VIEWER
  viewerCount: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  viewerCountText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // ✅ CLOSE BUTTON
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    zIndex: 1000,
    elevation: 10,
  },

  closeIcon: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    fontWeight: "700",
  },
});
